const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis({
    host: process.env.REDIS_HOST || 'redis',
    port: process.env.REDIS_PORT ||  6379,
    retryStrategy(times) {
        const delay = Math.min(times * 200, 2000);
        console.log(`[Redis] Retry attempt #${times} - reconnecting in ${delay}ms`);
        return delay;
    },
});

redis.on('connect', () => {
    console.log('[Redis] Connected successfully');
});

redis.on('error', (err) => {
    console.log('[Redis] Connection error', err.message);
});

redis.on('reconnecting', () => {
    console.log('[Redis] Attempting to reconnect..');
});

async function getWithRetry(key, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await redis.get(key);
    } catch (err) {
      console.warn(`[Redis GET] Failed attempt ${attempt}/${retries}: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

async function setWithRetry(key, value, mode, ttl, retries = 3, delay = 500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await redis.set(key, value, mode, ttl);
    } catch (err) {
      console.warn(`[Redis SET] Failed attempt ${attempt}/${retries}: ${err.message}`);
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

module.exports = {
  redis,
  getWithRetry,
  setWithRetry,
};