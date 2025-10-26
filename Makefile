.PHONY: up down logs migrate


up:
docker-compose up --build -d


down:
docker-compose down


logs:
docker-compose logs -f

migrate:
docker-compose exec -T app node scripts/init-db.js