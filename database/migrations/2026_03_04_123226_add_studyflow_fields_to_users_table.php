<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->string('avatar')->nullable();
            $table->string('google_id')->nullable()->unique();
            $table->string('timezone')->default('UTC');
            $table->unsignedInteger('daily_study_goal_minutes')->default(90);
            $table->unsignedTinyInteger('pomodoro_focus_minutes')->default(25);
            $table->unsignedTinyInteger('pomodoro_break_minutes')->default(5);
            $table->unsignedTinyInteger('pomodoro_long_break_minutes')->default(15);
            $table->unsignedTinyInteger('pomodoro_long_break_interval')->default(4);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table): void {
            $table->dropColumn([
                'avatar', 'google_id', 'timezone', 'daily_study_goal_minutes',
                'pomodoro_focus_minutes', 'pomodoro_break_minutes', 'pomodoro_long_break_minutes',
                'pomodoro_long_break_interval',
            ]);
        });
    }
};
