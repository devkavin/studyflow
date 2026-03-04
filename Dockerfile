FROM --platform=$BUILDPLATFORM php:8.3-fpm-alpine AS app
RUN apk add --no-cache git curl libpq-dev postgresql-dev zip unzip npm nodejs && docker-php-ext-install pdo pdo_pgsql
WORKDIR /var/www/html
COPY . .
RUN composer install --no-dev --optimize-autoloader --no-interaction && npm ci && npm run build && php artisan config:cache
RUN addgroup -S app && adduser -S app -G app && chown -R app:app /var/www/html
USER app
CMD ["php-fpm"]
