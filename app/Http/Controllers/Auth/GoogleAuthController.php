<?php
namespace App\Http\Controllers\Auth;
use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;
class GoogleAuthController extends Controller
{
    public function redirect() { return Socialite::driver('google')->redirect(); }
    public function callback()
    {
        $google = Socialite::driver('google')->stateless()->user();
        $user = User::updateOrCreate(['email' => $google->email], ['name' => $google->name, 'google_id' => $google->id, 'avatar' => $google->avatar, 'password' => Str::password(), 'email_verified_at' => now()]);
        Auth::login($user, true);
        AuditLog::create(['user_id' => $user->id, 'action' => 'auth.google_login']);
        return redirect()->route('dashboard');
    }
}
