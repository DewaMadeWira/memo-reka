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
    ];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'idstatus');
    }
    public function status(): BelongsTo
    {
        return $this->belongsTo(RequestStatus::class, 'status_id', 'idstatus');
    }
    public function stages(): BelongsTo
    {
        return $this->belongsTo(RequestStages::class, 'stages_id', 'idstatus');
    }
}
