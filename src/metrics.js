const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({timeout: 5000});

const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000] 
});

const httpRequestCount = new client.Counter({
    name: 'http_requests_total',
    help: 'Total HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

const httpRequestErrors = new client.Counter({
    name: 'http_requests_errors_total',
    help: 'Total HTTP requests resulting in 4xx or 5xx',
    labelNames: ['method', 'route', 'status_code'],
});

module.exports = { client, httpRequestDurationMicroseconds, httpRequestCount, httpRequestErrors };