dev:
	docker compose -f docker-compose.dev.yml up --build

dev-db-up:
	docker compose -f docker-compose.dev.yml up -d db

dev-app-up:
	docker compose -f docker-compose.dev.yml up -d --build app

dev-migrate:
	docker compose -f docker-compose.dev.yml exec app php artisan migrate

test:
	php artisan test

prod-up:
	docker compose -f docker-compose.prod.yml up -d --build

prod-db-up:
	docker compose -f docker-compose.prod.yml up -d db

prod-app-up:
	docker compose -f docker-compose.prod.yml up -d --build app

prod-migrate:
	docker compose -f docker-compose.prod.yml exec app php artisan migrate --force

migrate:
	php artisan migrate
