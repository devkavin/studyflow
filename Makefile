dev:
	docker compose -f docker-compose.dev.yml up --build

test:
	php artisan test

prod-up:
	docker compose -f docker-compose.prod.yml up -d --build

migrate:
	php artisan migrate
