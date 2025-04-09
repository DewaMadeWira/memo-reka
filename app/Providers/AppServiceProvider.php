<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        Gate::define('admin', function ($user) {
            $user = User::with('role')->with('division')->where("id", $user->id)->get();
            return $user[0]->role->role_name === 'admin';
        });

        Gate::define('manage-profile', function (User $user) {
            return true;
        });

        Gate::define('manage-users', function (User $user) {
            return $user->hasRole(1);
        });
        // Gate::after(function ($result, $user, $ability) {
        //     if (!$result) {
        //         return redirect()->route('dashboard')->with('error', 'You do not have permission to access this resource.');
        //     }
        // });
    }
}
