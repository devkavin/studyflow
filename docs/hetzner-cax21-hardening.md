# StudyFlow hardening + performance notes for Hetzner CAX21

## Findings from quick vulnerability checks
- `npm audit --package-lock-only --audit-level=moderate`: no known vulnerable npm dependencies.
- `composer audit --no-interaction`: audit skipped in this environment because Composer dependencies are not installed yet.

## App-level hardening already applied in this repo
- Nginx security headers (CSP, Referrer-Policy, Permissions-Policy, X-Frame-Options, X-Content-Type-Options).
- Nginx now hides server tokens and limits upload/request body size.
- Nginx blocks direct access to sensitive files like `.env`, `composer.lock`, `artisan`.
- Production compose no longer binds web container to a public host port; Traefik should reach it over Docker network.
- Web container now uses read-only root filesystem, dropped Linux capabilities, and `no-new-privileges`.
- PHP production image enables hardened settings (`expose_php=Off`) and tuned OPcache.
- PHP-FPM process manager tuned for CAX21 (4 vCPU / 8 GB RAM) with controlled worker limits.

## Hetzner Console-side hardening checklist
1. **Cloud Firewall**
   - Allow inbound only: `22/tcp` (your office/VPN IP only), `80/tcp`, `443/tcp`.
   - Deny all other inbound ports.
2. **SSH key-only auth**
   - Disable password auth in `/etc/ssh/sshd_config` (`PasswordAuthentication no`).
   - Keep root login disabled (`PermitRootLogin no`).
3. **Backups and snapshots**
   - Enable automated server backups in Hetzner Console.
   - Create snapshot before major deploys/migrations.
4. **Private networking**
   - Put DB workloads on private networks only if you split services across servers.
5. **DDoS + traffic controls**
   - Keep Hetzner DDoS protection enabled (default).
   - Optionally front with Cloudflare proxy + WAF for rate limiting / bot mitigation.
6. **Monitoring/alerts**
   - Enable Hetzner server metrics.
   - Add external uptime checks for `/health` over HTTPS.

## CAX21 performance tips
1. Keep one app instance + one nginx + one postgres on CAX21 initially.
2. Prefer OPcache with `validate_timestamps=0` in immutable production images.
3. Keep queue and scheduler in separate lightweight containers if background load grows.
4. Tune Postgres memory conservatively (e.g., `shared_buffers` ~1GB, `work_mem` 16MB start point).
5. Use swap (2G) only as safety net; avoid sustained swapping.
6. Use `docker compose pull && docker compose up -d --build` during low-traffic windows.

## Post-deploy validation commands
- `docker compose -f docker-compose.prod.yml ps`
- `docker compose -f docker-compose.prod.yml logs --tail=100 web app`
- `curl -I https://your-domain/health`
- `curl -sS https://your-domain/health`
