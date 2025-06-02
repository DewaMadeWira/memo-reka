<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use App\Models\Setting;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // return [
        //     ...parent::share($request),
        //     'auth' => [
        //         'user' => $request->user(),
        //     ],
        // ];
        // return [
        //     ...parent::share($request),
        //     'auth' => [
        //         'user' => $request->user(),
        //     ],
        //     'notifications' => $request->user()
        //         ? $request->user()->unreadNotifications()->get()
        //         : [],
        // ];
        // return array_merge(parent::share($request), [
        //     'auth' => [
        //         'user' => $request->user(),
        //     ],
        //     'flash' => [
        //         'message' => fn() => $request->session()->get('message')
        //     ],
        //     // Add application settings to shared data
        //     'appSettings' => [
        //         'company_name' => Setting::get('company_name', 'Memo'),
        //         'company_logo' => Setting::get('company_logo', '/assets/images/logo_reka.png'),
        //         'company_logo_small' => Setting::get('company_logo_small', '/assets/images/icon.png'),
        //         'company_code' => Setting::get('company_code', 'MR'),
        //     ],
        // ]);
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'message' => fn() => $request->session()->get('message')
            ],
            // Add application settings to shared data
            'appSettings' => fn() => [
                'company_name' => Setting::get('company_name'),
                'company_logo' => Setting::get('company_logo'),
                'company_logo_small' => Setting::get('company_logo_small'),
                'company_code' => Setting::get('company_code'),
            ],
        ]);
    }
}
