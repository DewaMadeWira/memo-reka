<?php

namespace App\Jobs;

use App\Models\Notification;
use App\Models\RequestLetter;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class SendMemoNotification implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    protected $userId;
    protected $title;
    protected $message;
    protected $requestId;

    public function __construct($userId, $title, $message, $requestId)
    {
        $this->userId = $userId;
        $this->title = $title;
        $this->message = $message;
        $this->requestId = $requestId;
    }


    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
        Notification::create([
            'user_id' => $this->userId,
            'title' => $this->title,
            'message' => $this->message,
            'related_request_id' => $this->requestId,
        ]);
    }
}
