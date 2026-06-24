<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        return static::query()->where('key', $key)->value('value') ?? $default;
    }

    public static function setValue(string $key, mixed $value, string $type = 'string', string $group = 'general'): self
    {
        return static::query()->updateOrCreate(
            ['key' => $key],
            ['value' => $value, 'type' => $type, 'group' => $group]
        );
    }

    public static function putMany(array $settings, string $group): void
    {
        foreach ($settings as $key => $value) {
            static::setValue($key, $value, 'string', $group);
        }
    }
}
