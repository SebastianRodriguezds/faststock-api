require('dotenv').config();
const express = require('express');
const pino = require('pino'); 
const logger = pino();

const productsRouter = require('./routes/products');

const app = express();
app.use(express.json());

app.use('/api/products', productsRouter);

const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => { 
    logger.info(`FastStock API listening on port ${port}`);
});
