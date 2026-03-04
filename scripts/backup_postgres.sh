#!/usr/bin/env bash
set -euo pipefail
TS=$(date +%F-%H%M%S)
mkdir -p backups
PGPASSWORD="${DB_PASSWORD}" pg_dump -h "${DB_HOST}" -U "${DB_USERNAME}" -d "${DB_DATABASE}" -Fc > "backups/studyflow-${TS}.dump"
