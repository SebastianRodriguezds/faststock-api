const db = require('../db/postgres');
const cache = require('../db/redis');


const CACHE_TTL = Number(process.env.CACHE_TTL_SECONDS || 60);


async function getProduct(id) {
const cacheKey = `product:${id}:full`;
const cached = await cache.get(cacheKey);
if (cached) return JSON.parse(cached);


const res = await db.query('SELECT id, name, price, stock FROM products WHERE id=$1', [id]);
const row = res.rows[0];
if (!row) return null;
await cache.set(cacheKey, JSON.stringify(row), 'EX', CACHE_TTL);
return row;
}


async function getStock(id) {
const cacheKey = `product:${id}:stock`;
const cached = await cache.get(cacheKey);
if (cached) return Number(cached);


const res = await db.query('SELECT stock FROM products WHERE id=$1', [id]);
const stock = res.rows[0] ? res.rows[0].stock : null;
if (stock !== null) await cache.set(cacheKey, String(stock), 'EX', CACHE_TTL);
return stock;
}


async function updateStock(id, newStock) {
await db.query('UPDATE products SET stock=$1 WHERE id=$2', [newStock, id]);
// invalidar cache
await cache.del(`product:${id}:stock`);
await cache.del(`product:${id}:full`);
}


module.exports = { getProduct, getStock, updateStock };