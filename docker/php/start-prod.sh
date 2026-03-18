#!/bin/sh
set -eu

mkdir -p \
    /var/www/html/storage/framework/cache \
    /var/www/html/storage/framework/sessions \
    /var/www/html/storage/framework/testing \
    /var/www/html/storage/framework/views \
    /var/www/html/storage/logs \
    /var/www/html/storage/app/public \
    /var/www/html/bootstrap/cache

# The repo may contain locally generated Laravel manifests that include dev-only providers.
# Clear them before any Artisan bootstrap in production.
rm -f /var/www/html/bootstrap/cache/*.php

php artisan package:discover --ansi --no-interaction

exec php-fpm -F
