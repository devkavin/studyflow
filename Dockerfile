# syntax=docker/dockerfile:1.7

ARG PHP_VERSION=8.4
ARG NODE_VERSION=22

FROM php:${PHP_VERSION}-fpm-alpine AS php-base

WORKDIR /var/www/html

RUN apk add --no-cache \
    bash \
    curl \
    git \
    icu-dev \
    libpq-dev \
    libzip-dev \
    oniguruma-dev \
    unzip \
    zip \
    && docker-php-ext-install -j"$(nproc)" \
        bcmath \
        intl \
        opcache \
        pdo_pgsql \
        zip

COPY --from=composer:2.8 /usr/bin/composer /usr/local/bin/composer

FROM node:${NODE_VERSION}-alpine AS node-deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    if [ -f package-lock.json ]; then npm ci; else npm install; fi

FROM php-base AS composer-deps
COPY composer.json composer.lock ./
RUN --mount=type=cache,target=/tmp/composer-cache \
    COMPOSER_CACHE_DIR=/tmp/composer-cache composer install \
        --no-dev \
        --no-interaction \
        --no-scripts \
        --no-progress \
        --prefer-dist \
        --optimize-autoloader

FROM node-deps AS assets-build
COPY . .
RUN npm run build

FROM caddy:2.8-alpine AS web

WORKDIR /var/www/html

COPY public ./public
COPY --from=assets-build /app/public/build ./public/build
COPY docker/caddy/Caddyfile /etc/caddy/Caddyfile

FROM php-base AS production

ENV APP_ENV=production \
    APP_DEBUG=false

COPY . .
COPY --from=composer-deps /var/www/html/vendor ./vendor
COPY --from=assets-build /app/public/build ./public/build

RUN rm -rf docs node_modules tests \
    && rm -f public/hot \
    && rm -f bootstrap/cache/*.php \
    && addgroup -g 1000 -S app \
    && adduser -u 1000 -S -D -G app app \
    && mkdir -p storage/framework/cache storage/framework/sessions storage/framework/testing storage/framework/views storage/logs bootstrap/cache \
    && chown -R app:app /var/www/html

COPY docker/php/opcache.ini /usr/local/etc/php/conf.d/99-opcache.ini
COPY docker/php/www.conf /usr/local/etc/php-fpm.d/www.conf
COPY --chmod=755 docker/php/start-prod.sh /usr/local/bin/start-prod

USER app
EXPOSE 9000
CMD ["start-prod"]

FROM php-base AS dev

RUN apk add --no-cache nodejs npm

COPY composer.json composer.lock ./
RUN composer install --no-interaction --prefer-dist --no-scripts

COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

EXPOSE 8000 5173
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
