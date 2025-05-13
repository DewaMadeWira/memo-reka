<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Collection;
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
        'summary_id',
        'to_stages',
        'rejected_stages',
        'progress_stages',
    ];
    protected $casts = [
        'progress_stages' => 'array', // Ensures it's always an array
    ];
    protected $attributes = [
        'progress_stages' => '[]', // Default empty array as JSON string
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
    public function getStageModelsAttribute(): Collection
    {
        $multi_stage = $this->progress_stages ?? [];
        return RequestStages::whereIn('id', $multi_stage)->get();
    }
    public function memo(): BelongsTo
    {
        return $this->belongsTo(MemoLetter::class, 'memo_id', 'id');
    }
    public function invite(): BelongsTo
    {
        return $this->belongsTo(InvitationLetter::class, 'invitation_id', 'id');
    }
    public function summary(): BelongsTo
    {
        return $this->belongsTo(SummaryLetter::class, 'summary_id', 'id');
    }
}
