<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RequestStages extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'stage_name',
        'sequence',
        'to_stage_id',
        'rejected_id',
        'conditions',
        'letter_id',
        'approver_id',
        'status_id',
    ];
    public function letter_type(): BelongsTo
    {
        return $this->belongsTo(LetterType::class, 'letter_id', 'id');
        // return $this->hasMany(LetterType::class, '_id', 'id');
    }
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id', 'id');
    }
    public function status(): BelongsTo
    {
        return $this->belongsTo(RequestStatus::class, 'status_id', 'id');
    }
    public function request_approved(): HasOne
    {
        return $this->hasOne(RequestStages::class, 'to_stage_id', 'id');
    }
    public function request_rejected(): HasOne
    {
        return $this->hasOne(RequestStages::class, 'rejected_id', 'id');
    }
}
