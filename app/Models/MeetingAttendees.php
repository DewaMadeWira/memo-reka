<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeetingAttendees extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'user_id',
        'invitation_letter_id',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(InvitedUser::class, 'user_id', 'id');
    }
}
