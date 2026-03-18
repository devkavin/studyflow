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
The production stack is now self-contained: `web` (Caddy with automatic HTTPS), `app` (Laravel PHP-FPM), and `db` (Postgres). There is no external Traefik, no extra Docker network, and no host nginx setup.

1. Point a domain to the server IP.
   - A real domain is recommended.
   - For a quick test, a temporary hostname like `studyflow.<server-ip>.sslip.io` also works.
2. Create the production env file:
   - `cp .env.production.example .env`
3. Set the required values in `.env`:
   - `APP_URL=https://<your-domain>`
   - `APP_HOST=<your-domain>`
   - keep `WEB_HTTP_PORT=80` and `WEB_HTTPS_PORT=443` on the server
   - `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
4. Generate an app key safely:
   - `docker compose -f docker-compose.prod.yml run --rm app php artisan key:generate --show`
   - paste the output into `.env` as `APP_KEY=...`
5. Start the full stack:
   - `docker compose -f docker-compose.prod.yml up -d --build`
6. Run migrations:
   - `docker compose -f docker-compose.prod.yml exec app php artisan migrate --force`
7. Verify:
   - `docker compose -f docker-compose.prod.yml ps`
   - `docker compose -f docker-compose.prod.yml logs -f app web db`

The app container is intentionally simple:
- It runs as a non-root user.
- Laravel logs go to Docker logs (`stderr`) instead of files.
- Only `storage` and `bootstrap/cache` stay writable.
- Caddy terminates TLS and serves static assets directly.

## First-time Hetzner terminal setup (copy/paste guide)
Use these steps right after opening the terminal on a brand-new Hetzner Ubuntu server.

1. Install required packages (Git + Docker Engine + Compose plugin):
   - `sudo apt update && sudo apt install -y ca-certificates curl gnupg git ufw`
   - `sudo install -m 0755 -d /etc/apt/keyrings`
   - `curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg`
   - `sudo chmod a+r /etc/apt/keyrings/docker.gpg`
   - `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`
   - `sudo apt update && sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin`
   - `sudo usermod -aG docker $USER` (log out/in once after this)

2. Configure a minimal host firewall (safe default):
   - `sudo ufw allow OpenSSH && sudo ufw allow 80/tcp && sudo ufw allow 443/tcp && sudo ufw --force enable`

3. Clone the app:
   - `sudo mkdir -p /srv && sudo chown -R $USER:$USER /srv`
   - `cd /srv && git clone <YOUR_REPO_URL> studyflow && cd studyflow`

4. Create and configure `.env`:
   - `cp .env.production.example .env`
   - Set at minimum: `APP_URL=https://<your-domain>`, `APP_HOST=<your-domain>`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`.
   - Make sure your DNS `A` record already points `<your-domain>` at the server before first start, otherwise HTTPS issuance will fail.

5. Generate app key safely and place it in `.env`:
   - `docker compose -f docker-compose.prod.yml run --rm app php artisan key:generate --show`
   - Copy output into `.env` as `APP_KEY=...`

6. Start the stack:
   - `docker compose -f docker-compose.prod.yml up -d --build`

7. Run migrations:
   - `docker compose -f docker-compose.prod.yml exec app php artisan migrate --force`

8. Verify everything is running:
   - `docker compose -f docker-compose.prod.yml ps`
   - `docker compose -f docker-compose.prod.yml logs -f app web db`

### Fast rerun after git pull
From `/srv/studyflow`, update with:
- `git pull`
- `docker compose -f docker-compose.prod.yml up -d --build`
- `docker compose -f docker-compose.prod.yml exec app php artisan migrate --force`


### Troubleshooting: HTTPS is not coming up
The most common cause is DNS not pointing at the server yet, or `APP_HOST` not matching the hostname you are visiting exactly.

Check:
- `APP_HOST` and `APP_URL` use the same domain
- the domain resolves to the Hetzner server IP
- ports `80` and `443` are open in `ufw` and any Hetzner firewall

Then inspect Caddy:
- `docker compose -f docker-compose.prod.yml logs -f web`

### Troubleshooting: port `80` or `443` is already in use locally
On Windows this is often `PID 4` (`System` / HTTP.sys, commonly IIS or another host web binding).

For local-only testing you can remap the host ports in `.env`:
- `WEB_HTTP_PORT=8080`
- `WEB_HTTPS_PORT=8443`

Then start the stack and open `https://localhost:8443` directly.

### Troubleshooting: `file_get_contents(/var/www/html/.env)` during `key:generate`
The production image does not copy `.env` into the container, so `docker compose exec app php artisan key:generate`
cannot write `/var/www/html/.env`. Generate a key with `--show` and paste it into the host `.env` file instead:

- `docker compose -f docker-compose.prod.yml run --rm app php artisan key:generate --show`

### Production deployment commands (without `make`)
0. Ensure `.env` exists and has required values:
   - `cp -n .env.production.example .env`
   - set `APP_URL`, `APP_HOST`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, `APP_KEY`
1. Start the stack:
   - `docker compose -f docker-compose.prod.yml up -d --build`
2. Run migrations:
   - `docker compose -f docker-compose.prod.yml exec app php artisan migrate --force`
3. Check running services:
   - `docker compose -f docker-compose.prod.yml ps`
4. Tail logs during rollout:
   - `docker compose -f docker-compose.prod.yml logs -f app web db`
5. Update deployment after pulling new code:
   - `docker compose -f docker-compose.prod.yml up -d --build`

## Security checklist
- Expose only `22`, `80`, and `443` publicly.
- Use strong `.env` secrets (APP_KEY, DB password, Google OAuth creds).
- Keep `APP_ENV=production` and `APP_DEBUG=false`.
- Session hardening in `.env` for production:
  - `SESSION_SECURE_COOKIE=true`
  - `SESSION_HTTP_ONLY=true`
  - `SESSION_SAME_SITE=lax`
- Run as non-root container user.
- Let Caddy handle HTTPS termination and certificate renewal.
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
