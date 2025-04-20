<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;

class ServeImageController extends Controller
{
    //
    public function show($filename)
    {
        $path = storage_path('app/private/private/bukti-memo/' . $filename);
        if (!file_exists($path)) {
            abort(404);
        }
        return Response::file($path);
    }
}
