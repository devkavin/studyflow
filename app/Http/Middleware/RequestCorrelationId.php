<?php
namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class RequestCorrelationId
{
    public function handle(Request $request, Closure $next)
    {
        $id = $request->header('X-Request-Id', (string) Str::uuid());
        $request->headers->set('X-Request-Id', $id);
        $response = $next($request);
        $response->headers->set('X-Request-Id', $id);
        return $response;
    }
}
