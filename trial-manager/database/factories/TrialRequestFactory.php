<?php

namespace Database\Factories;

use App\Models\TrialRequest;
use Illuminate\Database\Eloquent\Factories\Factory;

/** @extends Factory<TrialRequest> */
class TrialRequestFactory extends Factory
{
    protected $model = TrialRequest::class;

    public function definition(): array
    {
        $country = fake()->randomElement([
            ['Morocco', '+212'],
            ['France', '+33'],
            ['United States', '+1'],
            ['Spain', '+34'],
            ['Germany', '+49'],
        ]);

        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'whatsapp' => $country[1].fake()->numerify('#########'),
            'country' => $country[0],
            'dial_code' => $country[1],
            'device' => fake()->randomElement(['Smart TV', 'Android Box', 'iPhone', 'Android Phone', 'MAG Box', 'Fire Stick']),
            'plan' => fake()->randomElement(['Free Trial', 'Premium IPTV Trial', 'Family Trial']),
            'message' => fake()->optional()->sentence(10),
            'ip_address' => fake()->ipv4(),
            'status' => fake()->randomElement(TrialRequest::STATUSES),
            'created_at' => fake()->dateTimeBetween('-14 days', 'now'),
        ];
    }
}
