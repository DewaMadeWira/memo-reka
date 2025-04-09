<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Auth\Access\AuthorizationException;
use Inertia\Inertia;
use Throwable;
use Illuminate\Support\Facades\Log;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $e)
    {
        Log::debug('Exception type: ' . get_class($e) . ', Message: ' . $e->getMessage());
        // Make sure we're catching all authorization exceptions
        if ($e instanceof AuthorizationException || $e instanceof \Illuminate\Auth\AuthenticationException) {
            // Check if this is an API request
            Log::debug('Handling AuthorizationException with custom page');
            // Your custom handling
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Unauthorized.'], 403);
            }

            // For web requests, render the Inertia page
            // Make sure the path matches your actual component structure
            return Inertia::render('Error/Unauthorized/Index', [
                'message' => 'You do not have permission to access this resource.'
            ])->toResponse($request)->setStatusCode(403);
        }

        return parent::render($request, $e);
    }
}
