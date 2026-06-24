<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_manager_user(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $this->actingAs($admin)->post(route('users.store'), [
            'name' => 'Manager User',
            'email' => 'manager@example.com',
            'password' => 'password123',
            'role' => User::ROLE_MANAGER,
        ])->assertRedirect();

        $this->assertDatabaseHas('users', ['email' => 'manager@example.com', 'role' => User::ROLE_MANAGER]);
    }
}
