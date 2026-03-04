<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class GoogleAuthController extends Controller
{
    public function redirect(): RedirectResponse
    {
        return Socialite::driver('google')
            ->scopes(['openid', 'profile', 'email'])
            ->redirect();
    }

    public function callback()
    {
        $google = Socialite::driver('google')->stateless()->user();

        $user = User::updateOrCreate(
            ['email' => $google->email],
            [
                'name' => $google->name,
                'google_id' => $google->id,
                'avatar' => $google->avatar,
                'password' => Str::password(),
                'email_verified_at' => now(),
            ],
        );

        Auth::login($user, true);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'auth.google_login',
        ]);

        return redirect()->route('dashboard');
    }

    public function token(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'id_token' => ['required', 'string'],
        ]);

        $tokenResponse = Http::asForm()
            ->get('https://oauth2.googleapis.com/tokeninfo', ['id_token' => $validated['id_token']]);

        abort_unless($tokenResponse->ok(), 422, 'Unable to verify Google token.');

        $tokenInfo = $tokenResponse->json();

        abort_unless(
            ($tokenInfo['aud'] ?? null) === config('services.google.client_id'),
            422,
            'Invalid Google token audience.',
        );

        abort_unless(
            ($tokenInfo['email_verified'] ?? 'false') === 'true' && ! empty($tokenInfo['email']),
            422,
            'Google account email must be verified.',
        );

        $user = User::updateOrCreate(
            ['email' => $tokenInfo['email']],
            [
                'name' => $tokenInfo['name'] ?? strtok($tokenInfo['email'], '@'),
                'google_id' => $tokenInfo['sub'] ?? null,
                'avatar' => $tokenInfo['picture'] ?? null,
                'password' => Str::password(),
                'email_verified_at' => now(),
            ],
        );

        Auth::login($user, true);

        AuditLog::create([
            'user_id' => $user->id,
            'action' => 'auth.google_login',
        ]);

        return redirect()->route('dashboard');
    }
}
