<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('focus_sessions', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('topic_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('task_id')->nullable()->constrained()->nullOnDelete();
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->unsignedInteger('duration_seconds')->default(0);
            $table->string('mode')->default('pomodoro');
            $table->boolean('is_active')->default(true);
            $table->timestamp('paused_at')->nullable();
            $table->unsignedInteger('total_paused_seconds')->default(0);
            $table->unsignedSmallInteger('interruptions_count')->default(0);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->index(['user_id', 'start_time']);
        });
    }
    public function down(): void { Schema::dropIfExists('focus_sessions'); }
};
