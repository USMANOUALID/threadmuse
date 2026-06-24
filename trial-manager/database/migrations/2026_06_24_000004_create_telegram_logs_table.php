<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('telegram_logs', function (Blueprint $table): void {
            $table->id();
            $table->string('direction')->default('incoming')->index();
            $table->unsignedBigInteger('update_id')->nullable()->index();
            $table->json('payload')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('received')->index();
            $table->text('error')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telegram_logs');
    }
};
