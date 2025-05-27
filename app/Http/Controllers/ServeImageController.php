<?php

namespace App\Http\Controllers;


use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;


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
    public function show_pdf($filename)
    {
        $path = storage_path('app/private/risalah-rapat/' . $filename);
        if (!file_exists($path)) {
            abort(404);
        }
        // return Response::file($path);

        $file = File::get($path);
        $type = File::mimeType($path);

        $response = Response::make($file, 200);
        $response->header("Content-Type", $type);
        $response->header("Content-Disposition", "inline; filename=\"$filename\"");
        // Prevent caching to avoid saving
        $response->header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
        $response->header("Pragma", "no-cache");
        $response->header("Expires", "0");
        // Disable right-click
        $response->header("X-Content-Type-Options", "nosniff");

        return $response;
    }
}
