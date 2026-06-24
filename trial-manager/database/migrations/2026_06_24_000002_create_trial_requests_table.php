<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trial_requests', function (Blueprint $table): void {
            $table->id();
            $table->string('name');
            $table->string('email')->nullable()->index();
            $table->string('whatsapp', 40)->index();
            $table->string('country', 120)->nullable()->index();
            $table->string('dial_code', 20)->nullable();
            $table->string('device', 120)->nullable();
            $table->string('plan', 120)->default('Free Trial')->index();
            $table->text('message')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected', 'processed'])->default('pending')->index();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();

            $table->index(['status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trial_requests');
    }
};
