<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'avatar',
        'google_id',
        'timezone',
        'daily_study_goal_minutes',
        'pomodoro_focus_minutes',
        'pomodoro_break_minutes',
        'pomodoro_long_break_minutes',
        'pomodoro_long_break_interval',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return ['email_verified_at' => 'datetime', 'password' => 'hashed'];
    }

    public function subjects(): HasMany { return $this->hasMany(Subject::class); }
    public function focusSessions(): HasMany { return $this->hasMany(FocusSession::class); }
    public function todoItems(): HasMany { return $this->hasMany(TodoItem::class); }
}
