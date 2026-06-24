<?php

namespace Database\Seeders;

use App\Models\TrialRequest;
use Illuminate\Database\Seeder;

class TrialRequestSeeder extends Seeder
{
    public function run(): void
    {
        TrialRequest::factory()->count(36)->create();

        TrialRequest::query()->create([
            'name' => 'Ali Ali',
            'email' => 'amalaoui37@gmail.com',
            'whatsapp' => '+212648883065',
            'country' => 'Morocco',
            'dial_code' => '+212',
            'device' => 'Smart TV',
            'plan' => 'Free Trial',
            'message' => '',
            'ip_address' => '41.140.174.78',
            'status' => TrialRequest::STATUS_PENDING,
            'created_at' => '2026-06-19 15:01:38',
            'updated_at' => '2026-06-19 15:01:38',
        ]);
    }
}
