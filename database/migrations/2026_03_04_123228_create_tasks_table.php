<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('topic_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('notes')->nullable();
            $table->unsignedInteger('estimated_minutes')->default(30);
            $table->string('status')->default('todo');
            $table->date('due_date')->nullable();
            $table->unsignedTinyInteger('priority')->default(3);
            $table->timestamps();
            $table->softDeletes();
            $table->index(['user_id', 'status', 'due_date']);
        });
    }
    public function down(): void { Schema::dropIfExists('tasks'); }
};
