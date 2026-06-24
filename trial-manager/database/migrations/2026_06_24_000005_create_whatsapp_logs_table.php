<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('whatsapp_logs', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('trial_request_id')->nullable()->constrained()->nullOnDelete();
            $table->string('recipient', 60)->nullable()->index();
            $table->longText('message');
            $table->string('status')->default('logged')->index();
            $table->json('response')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('whatsapp_logs');
    }
};
