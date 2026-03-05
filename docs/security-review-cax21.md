# Security Review + CAX21 Optimization

## What was checked
- Dependency audit commands:
  - `composer audit`
  - `npm audit --omit=dev`
- Runtime edge hardening in nginx and app response headers.
- Docker production exposure and container hardening.
- PostgreSQL defaults and container resource fit for Hetzner CAX21.

## Findings and changes
1. **Potential bypass of reverse proxy path**
   - The production web container exposed `8000:80`, which can bypass Traefik policy/termination.
   - Fixed by removing host port mapping in `docker-compose.prod.yml`.

2. **Missing stricter response security headers**
   - Added CSP baseline, COOP/CORP, cross-domain policy deny, and conditional HSTS in Laravel middleware.

3. **Nginx hardening gaps**
   - Added `server_tokens off`, `always` header mode, hidden `X-Powered-By`, and timeout for FastCGI.

4. **CAX21 fit and container isolation**
   - Added explicit CPU/memory limits for app/web/db.
   - Added `no-new-privileges` to all services.
   - Enabled read-only filesystem + tmpfs on nginx service.

5. **PostgreSQL tune for ARM instance class**
   - Added practical defaults for `shared_buffers`, cache sizing, and WAL compression suitable for 8 GB class nodes.

## CAX21 sizing rationale
Hetzner CAX21 is an ARM64 instance class with moderate resources. The selected limits reserve headroom for the host OS and Traefik while preventing one service from starving others:
- app: `2.5 vCPU / 2 GB`
- web: `0.5 vCPU / 256 MB`
- db: `1.5 vCPU / 3 GB`

Adjust based on real telemetry (p95 latency, DB cache hit rate, queue depth).

## Recommended next steps
- Add a private network + separate database host when scaling beyond a single node.
- Add fail2ban/sshd hardening at host level.
- Add a managed off-site backup target for pg dumps.
- Add SAST/DAST in CI (e.g., semgrep + OWASP ZAP baseline).
