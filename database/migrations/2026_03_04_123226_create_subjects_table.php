<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('subjects', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('color')->default('#3b82f6');
            $table->unsignedTinyInteger('priority')->default(3);
            $table->timestamps();
            $table->softDeletes();
            $table->unique(['user_id', 'name']);
        });
    }
    public function down(): void { Schema::dropIfExists('subjects'); }
};
