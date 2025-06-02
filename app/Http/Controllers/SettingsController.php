<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::getAllSettings();

        return Inertia::render('Management/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|max:255',
            'company_code' => 'required|string|max:10',
            'company_logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'company_logo_small' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        // Update company name and code
        Setting::set('company_name', $request->company_name);
        Setting::set('company_code', $request->company_code);

        // Handle logo upload if provided
        if ($request->hasFile('company_logo')) {
            $path = $request->file('company_logo')->store('logos', 'public');
            Setting::set('company_logo', Storage::url($path));
        }

        // Handle small logo upload if provided
        if ($request->hasFile('company_logo_small')) {
            $path = $request->file('company_logo_small')->store('logos', 'public');
            Setting::set('company_logo_small', Storage::url($path));
        }

        // Clear settings cache
        Setting::clearCache();

        return redirect()->back()->with('success', 'Settings updated successfully');
    }
}
