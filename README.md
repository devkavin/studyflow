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
4. Create and configure app `.env`:
   - `cp .env.example .env`
   - set `APP_ENV=production`, `APP_DEBUG=false`, and `APP_URL`
   - set `DB_CONNECTION=pgsql`, `DB_HOST=db`, `DB_PORT=5432`
   - set `DB_DATABASE`, `DB_USERNAME`, and `DB_PASSWORD` (required)
   - set `APP_KEY` (recommended safe flow):
     - `docker compose -f docker-compose.prod.yml run --rm app php artisan key:generate --show`
     - paste output into `.env` as `APP_KEY=...`
5. Set `APP_HOST` in `.env` to the public hostname Traefik should route (example: `studyflow.135.181.33.50.sslip.io`).
6. Route that hostname to host IP (DNS `A` record, or use `sslip.io`).
7. Start services (recommended split startup):
   - `make prod-db-up`
   - `make prod-app-up`
8. Run migrations explicitly during deployment windows:
   - `make prod-migrate`


### Troubleshooting: Traefik shows `404 page not found`
Traefik returns 404 when no router rule matches the request host/entrypoint. Common causes:

- requested host does not match `APP_HOST` (for example hitting `135.181.33.50.sslip.io` while router expects `studyflow.135.181.33.50.sslip.io`)
- app router was configured only for `websecure` and request was sent to `http://`

This production compose config defines both an HTTP router (redirects to HTTPS) and an HTTPS router. Set `.env` `APP_HOST` and `APP_URL` to the same hostname, then redeploy:

- `docker compose -f docker-compose.prod.yml up -d --build web`
- `docker compose -f docker-compose.prod.yml logs -f web`

### Troubleshooting: `file_get_contents(/var/www/html/.env)` during `key:generate`
The production image does not copy `.env` into the container, so `docker compose exec app php artisan key:generate`
cannot write `/var/www/html/.env`. Generate a key with `--show` and paste it into the host `.env` file instead:

- `docker compose -f docker-compose.prod.yml run --rm app php artisan key:generate --show`

### Production deployment commands (without `make`)
0. Ensure `.env` exists and has required DB variables:
   - `cp -n .env.example .env`
   - set `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
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
- Expose only 80/443 publicly (through Traefik only).
- Use strong `.env` secrets (APP_KEY, DB password, Google OAuth creds).
- Keep `APP_ENV=production` and `APP_DEBUG=false`.
- Session hardening in `.env` for production:
  - `SESSION_SECURE_COOKIE=true`
  - `SESSION_HTTP_ONLY=true`
  - `SESSION_SAME_SITE=lax`
- Run as non-root container user.
- Enable HTTPS via Traefik cert resolver.
- Run `composer audit` and `npm audit` on each release.
- Keep monthly dependency updates.
- Configure backups: `scripts/backup_postgres.sh` (example cron: `0 2 * * * cd /srv/studyflow && ./scripts/backup_postgres.sh`).

## Hetzner Console hardening (recommended)
1. **Primary IP firewall**
   - Allow inbound: TCP `22` (restricted to your admin IPs), `80`, `443`.
   - Deny all other inbound ports.
2. **Placement groups + snapshots**
   - Use snapshots before major upgrades.
   - Consider a placement group when running multiple instances.
3. **Backups**
   - Enable Hetzner volume/server backups and test restore.
4. **SSH and access**
   - Disable password SSH auth; use keys only.
   - Use a non-root sudo user.
5. **Monitoring + alerting**
   - Turn on Hetzner monitoring and alert channels for CPU, memory, disk, and uptime.
6. **DDoS and edge**
   - Keep DDoS protection enabled.
   - Optionally front with Cloudflare for WAF/rate limiting.
7. **Patch cadence**
   - Schedule OS patching (unattended-upgrades or weekly maintenance window).

## Environment variables
- APP_NAME, APP_ENV, APP_KEY, APP_URL, APP_HOST
- DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD
- GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI
- SESSION_DOMAIN, SANCTUM_STATEFUL_DOMAINS

## Notes
- Health check endpoint: `/health`
- Queue driver defaults to `database`
- Data ownership enforced by `user_id` scoping in controllers
