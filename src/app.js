require('dotenv').config();
const express = require('express');
const pino = require('pino'); 
const logger = pino();

const app = express();
app.use(express.json());

const productsRouter = require('./routes/products');

const { client, httpRequestDurationMicroseconds, httpRequestCount, httpRequestErrors } = require('./metrics');

// Middleware to measure request
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        httpRequestDurationMicroseconds.observe({ method: req.method, route: req.path, status_code: res.statusCode }, duration);

        httpRequestCount.inc({ method: req.method, route: req.path, status_code: res.statusCode });
        if (res.statusCode >= 400) {
            httpRequestErrors.inc({ method: req.method, route: req.path, status_code: res.statusCode });
        }
    });
    next();
});


app.use('/api/products', productsRouter);

// Endpoint Prometheus
app.get('/metrics', async (req, res)=> {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => { 
    logger.info(`FastStock API listening on port ${port}`);
});
