# faststock-api

## Project objective
FastStock API is a REST API designed to efficiently handle thousands of concurrent requests. The project demonstrates scale, performance, and resilience, using PostgreSQL as the data source and Redis as the cache for frequent reads.

There is no frontend: the focus is on scalable backend design and load testing.

## Technology stack
* Node.js + Express
* PostgreSQL
* Redis
* Docker / docker-compose
* Locust / k6 for load testing

## Local installation
git close https://github.com/SebastianRodriguezds/faststock-api
cd faststock-api
docker-compose up --build -d

## Current endpoints
* GET /api/products/:id → Get product details by ID
* GET /api/products/:id/stock → Get product details by ID
* POST /api/products/:id/update-stock → Get product details by ID
Note: All frequent queries are cached in Redis to improve performance (when caching is implemented).

## Performance metrics (example)
| Metric                | Value       |
|-----------------------|-------------|
| Average latency       | 23 ms (simulated) |
| Maximum throughput    | 11.200 req/s (simulated) |
| Cache hits            | 87% (simulated) |
| CPU usage (500 VUs)   | 45% (simulated) |

## Scalability
Add API instances behind a load balancer
Read replicas for Redis and PostgreSQL
Cluster Mode and Node.js or PM2 to take advantage of multi-core CPUs