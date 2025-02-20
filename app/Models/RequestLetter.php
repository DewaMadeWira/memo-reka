<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RequestLetter extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'request_name',
        'user_id',
        'status_id',
        'stages_id',
        'memo_id',
        'invitation_id',
        'letter_type_id',
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    // public function status(): BelongsTo
    // {
    //     return $this->belongsTo(RequestStatus::class, 'status_id', 'id');
    // }
    public function stages(): BelongsTo
    {
        return $this->belongsTo(RequestStages::class, 'stages_id', 'id');
    }
    public function memo(): BelongsTo
    {
        return $this->belongsTo(MemoLetter::class, 'memo_id', 'id');
    }
    public function invite(): BelongsTo
    {
        return $this->belongsTo(InvitationLetter::class, 'invitation_id', 'id');
    }
}
