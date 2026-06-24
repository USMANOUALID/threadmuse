<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_login(): void
    {
        $user = User::factory()->create(['role' => User::ROLE_ADMIN, 'password' => 'password']);

        $response = $this->post(route('login.store'), [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $response->assertRedirect(route('dashboard'));
        $this->assertAuthenticatedAs($user);
    }

    public function test_login_is_throttled(): void
    {
        for ($i = 0; $i < 6; $i++) {
            $response = $this->post(route('login.store'), [
                'email' => 'missing@example.com',
                'password' => 'wrong-password',
            ]);
        }

        $response->assertStatus(429);
    }
}
