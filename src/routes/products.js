const express = require('express');
const router = express.Router();
const productService = require('../services/productService');

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
    const stock = req.body;
    try {
        await productService.updateStock(id, stock);
        res.json({id, stock});
    } catch (error) {
        res.status(500).json({ error: err.message});
    }
});

module.exports = router;
