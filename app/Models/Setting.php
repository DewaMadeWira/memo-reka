<?php

namespace App\Models;

use App\Constants\AppSettings;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    use HasFactory;

    protected $fillable = ['key', 'value'];

    /**
     * Get a setting by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get(string $key, $default = null)
    {
        // If no default is provided, use the one from constants
        $default = $default ?? (AppSettings::DEFAULTS[$key] ?? null);

        // Use cache to avoid frequent database queries
        return Cache::rememberForever("settings.{$key}", function () use ($key, $default) {
            $setting = self::where('key', $key)->first();
            return $setting && $setting->value ? $setting->value : $default;
        });
    }

    /**
     * Set a setting value
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public static function set(string $key, $value)
    {
        self::updateOrCreate(['key' => $key], ['value' => $value]);

        // Clear the cache for this key
        Cache::forget("settings.{$key}");
    }


    /**
     * Get all settings as an associative array
     *
     * @return array
     */
    public static function getAllSettings()
    {
        return Cache::rememberForever('settings.all', function () {
            $settings = self::all()->pluck('value', 'key')->toArray();

            // Merge with defaults to ensure all keys exist
            return array_merge(AppSettings::DEFAULTS, $settings);
        });
    }

    /**
     * Clear settings cache
     */
    public static function clearCache()
    {
        Cache::forget('settings.all');
        // You might want to clear individual setting caches too
    }
}
