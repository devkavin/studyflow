#!/usr/bin/env bash
set -euo pipefail

COMPOSE_FILE="${COMPOSE_FILE:-docker-compose.prod.yml}"
BACKUP_DIR="${BACKUP_DIR:-backups}"
TS=$(date +%F-%H%M%S)
mkdir -p "${BACKUP_DIR}"

docker compose -f "${COMPOSE_FILE}" exec -T db sh -lc 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "${BACKUP_DIR}/studyflow-${TS}.dump"
