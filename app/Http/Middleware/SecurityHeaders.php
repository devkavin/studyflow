<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');
        $response->headers->set('Cross-Origin-Resource-Policy', 'same-origin');
        $response->headers->set('X-Permitted-Cross-Domain-Policies', 'none');
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; " .
            "base-uri 'self'; " .
            "frame-ancestors 'self'; " .
            "form-action 'self'; " .
            "object-src 'none'; " .
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https: http:; " .
            "style-src 'self' 'unsafe-inline' https: http:; " .
            "img-src 'self' data: blob: https: http:; " .
            "font-src 'self' data: https: http:; " .
            "connect-src 'self' ws: wss: https: http:; " .
            "media-src 'self' data: blob: https: http:; " .
            "worker-src 'self' blob:;"
        );

        if ($request->isSecure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        return $response;
    }
}
