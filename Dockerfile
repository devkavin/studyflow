FROM --platform=$BUILDPLATFORM php:8.4-fpm-alpine AS app

RUN apk add --no-cache git curl libpq-dev postgresql-dev libzip-dev zip unzip npm nodejs libxml2-dev \
    && docker-php-ext-install pdo pdo_pgsql dom zip

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --optimize-autoloader --no-interaction \
    && npm install --include=dev \
    && npm run build \
    && php artisan config:cache

RUN addgroup -S app \
    && adduser -S app -G app \
    && chown -R app:app /var/www/html

USER app
CMD ["php-fpm"]
