<?php

namespace Tests\Feature;

use App\Models\TrialRequest;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class TrialRequestTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_update_and_delete_trial_request(): void
    {
        $admin = User::factory()->create(['role' => User::ROLE_ADMIN]);

        $create = $this->actingAs($admin)->post(route('trial-requests.store'), [
            'name' => 'Production User',
            'email' => 'production@example.com',
            'whatsapp' => '+15555550100',
            'country' => 'United States',
            'dial_code' => '+1',
            'device' => 'Smart TV',
            'plan' => 'Free Trial',
            'message' => 'Please activate trial.',
            'ip_address' => '127.0.0.1',
            'status' => TrialRequest::STATUS_PENDING,
        ]);

        $trialRequest = TrialRequest::query()->firstOrFail();
        $create->assertRedirect(route('trial-requests.show', $trialRequest));

        $this->actingAs($admin)->post(route('trial-requests.approve', $trialRequest))->assertRedirect();
        $this->assertSame(TrialRequest::STATUS_APPROVED, $trialRequest->fresh()->status);

        $this->actingAs($admin)->delete(route('trial-requests.destroy', $trialRequest))->assertRedirect(route('trial-requests.index'));
        $this->assertDatabaseMissing('trial_requests', ['id' => $trialRequest->id]);
    }
}
