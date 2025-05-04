<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    //
    protected $primaryKey = 'id';
      protected $fillable = [
        'user_id',
        'title',
        'message',
        'is_read',
        'related_request_id',
    ];
        public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function request()
    {
        return $this->belongsTo(RequestLetter::class, 'related_request_id');
    }

}
