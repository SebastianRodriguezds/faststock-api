const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const { getWithRetry, setWithRetry } = require('../db/redis');
const db = require('../db/postgres');
const { withRetry } = require('../utils/retry');
require('dotenv').config();

const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 60);

router.get('/', async (req, res) => {
  let { page = 1, limit = 10 } = req.query;
  page = Number(page);
  limit = Number(limit);
  const offset = (page - 1) * limit;

  try {
    const cacheKey = `products:page${page}:limit:${limit}`;

    let cached;
    try {
      cached = await getWithRetry(cacheKey);
    } catch (err) {
      console.warn('Redis get failed after retries:', err.message);
    }

    if (cached) {
      console.log(`[Cache hit] ${cacheKey}`);
      return res.json(JSON.parse(cached));
    }

    const result = await db.query(
      'SELECT id, name, price, stock FROM products ORDER BY id LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    try {
      await setWithRetry(cacheKey, JSON.stringify(result.rows), 'EX', CACHE_TTL);
      console.log(`[Cache set] ${cacheKey}`);
    } catch (err) {
      console.warn('Redis set failed after retries:', err.message);
    }

    res.json(result.rows);
  } catch (err) {
    console.error('Unexpected error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
    const id= req.params.id;
    try{
        const product = await productService.getProduct(id);
        if (!product) return res.status(404).json({ message: 'Not found'});
        res.json(product);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

router.get('/:id/stock', async(req, res)=> {
    const id = req.params.id;
    try {
        const stock = await productService.getStock(id);
        return res.json({id, stock});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

router.post('/:id/update-stock', async (req, res)=> {
    const id = req.params.id;
    const { stock } = req.body;
    try {
        await productService.updateStock(id, stock);
        res.json({id, stock});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;
