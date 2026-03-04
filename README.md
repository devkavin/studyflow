# StudyFlow

StudyFlow is a Laravel 12 + Inertia React app for curriculum planning, focus tracking, todos, and analytics.

## Local development
1. `cp .env.example .env`
2. Set DB to postgres service values.
3. Start services (recommended split startup):
   - `make dev-db-up`
   - `make dev-app-up`
4. Run migrations only when you intend to change schema:
   - `make dev-migrate`

### If `make` is unavailable
Use these equivalent Docker Compose commands:

1. Start only Postgres:
   - `docker compose -f docker-compose.dev.yml up -d db`
2. Start app + Vite:
   - `docker compose -f docker-compose.dev.yml up -d --build app vite`
3. Run migrations:
   - `docker compose -f docker-compose.dev.yml exec app php artisan migrate`
4. Run tests:
   - `docker compose -f docker-compose.dev.yml exec app php artisan test`
5. Follow logs (optional):
   - `docker compose -f docker-compose.dev.yml logs -f app vite db`
6. Stop stack:
   - `docker compose -f docker-compose.dev.yml down`

## Test
- `make test`
- `php artisan test --filter=StudyFlow`

## Audits
- `composer audit`
- `npm audit`

## Production (Hetzner CAX21 ARM64)
1. Install Docker + Compose plugin.
2. `docker network create proxy`
3. Run Traefik stack once:
   - `cd infra/traefik`
   - create `.env` with `TRAEFIK_ACME_EMAIL`
   - `mkdir -p letsencrypt && touch letsencrypt/acme.json && chmod 600 letsencrypt/acme.json`
   - `docker compose up -d`
4. Configure app `.env` and route domain `solidscalelabs.studyflow.com` to host IP.
5. Start services (recommended split startup):
   - `make prod-db-up`
   - `make prod-app-up`
6. Run migrations explicitly during deployment windows:
   - `make prod-migrate`

### Production deployment commands (without `make`)
1. Start only Postgres:
   - `docker compose -f docker-compose.prod.yml up -d db`
2. Start app + nginx:
   - `docker compose -f docker-compose.prod.yml up -d --build app web`
3. Run migrations:
   - `docker compose -f docker-compose.prod.yml exec app php artisan migrate --force`
4. Check running services:
   - `docker compose -f docker-compose.prod.yml ps`
5. Tail logs during rollout:
   - `docker compose -f docker-compose.prod.yml logs -f app web db`
6. Update deployment after pulling new code:
   - `docker compose -f docker-compose.prod.yml up -d --build app web`

## Security checklist
- Expose only 80/443 publicly.
- Use strong `.env` secrets (APP_KEY, DB password, Google OAuth creds).
- Run as non-root container user.
- Enable HTTPS via Traefik cert resolver.
- Run `composer audit` and `npm audit` on each release.
- Keep monthly dependency updates.
- Configure backups: `scripts/backup_postgres.sh` (example cron: `0 2 * * * cd /srv/studyflow && ./scripts/backup_postgres.sh`).

## Environment variables
- APP_NAME, APP_ENV, APP_KEY, APP_URL
- DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
- SESSION_DOMAIN, SANCTUM_STATEFUL_DOMAINS

## Notes
- Health check endpoint: `/health`
- Queue driver defaults to `database`
- Data ownership enforced by `user_id` scoping in controllers
