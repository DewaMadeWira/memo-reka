<?php

namespace App\Http\Services;

use App\Models\RequestLetter;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function index()
    {
        $user = Auth::user();
        return  $user = User::with('role')->with('division')->where("id", $user->id)->first();
    }
    public function userDivision()
    {
        $user = Auth::user();
        $user = User::with('role')->with('division')->where("id", $user->id)->first();

        return  $user = $user->division->id;
    }
}
