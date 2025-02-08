<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class RequestStages extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'stage_name',
        'sequence',
        'to_stage_id',
        'conditions',
        'letter_id',
        'approver_id',
    ];
    public function letter_type(): BelongsTo
    {
        return $this->belongsTo(LetterType::class, 'letter_id', 'id');
    }
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approver_id', 'id');
    }
    public function request_stages(): HasOne
    {
        return $this->hasOne(RequestStages::class, 'to_stage_id', 'id');
    }
}
