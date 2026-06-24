<?php

namespace App\Models;

use Illuminate\Contracts\Encryption\DecryptException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;

class Setting extends Model
{
    private const ENCRYPTED_KEYS = [
        'telegram_bot_token',
        'telegram_webhook_secret',
        'whatsapp_cloud_access_token',
        'whatsapp_verify_token',
    ];

    protected $fillable = [
        'key',
        'value',
        'type',
        'group',
    ];

    public static function getValue(string $key, mixed $default = null): mixed
    {
        $value = static::query()->where('key', $key)->value('value');

        if ($value === null) {
            return $default;
        }

        if (! static::shouldEncrypt($key)) {
            return $value;
        }

        try {
            return Crypt::decryptString($value);
        } catch (DecryptException) {
            return $value;
        }
    }

    public static function setValue(string $key, mixed $value, string $type = 'string', string $group = 'general'): self
    {
        if (static::shouldEncrypt($key) && filled($value)) {
            $value = Crypt::encryptString((string) $value);
            $type = 'encrypted';
        }

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

    public static function isEncryptedKey(string $key): bool
    {
        return static::shouldEncrypt($key);
    }

    private static function shouldEncrypt(string $key): bool
    {
        return in_array($key, self::ENCRYPTED_KEYS, true);
    }
}
