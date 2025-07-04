<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestStages extends Model
{
    //
    use SoftDeletes;
    protected $primaryKey = 'id';
    protected $appends = ['dynamic_to_stage_id', 'dynamic_rejected_id'];
    protected $fillable = [
        'stage_name',
        'sequence',
        'to_stage_id',
        'rejected_id',
        // 'conditions',
        'description',
        'letter_id',
        'approver_id',
        'status_id',
        'requires_rejection_reason',
        'is_fixable',
        'requires_file_upload',
        'is_external',
        'is_fixable',
        'requires_rejection_reason',
        'is_external',
        'notify_internal_manager',
        'notify_internal_user',
        'notify_internal',
        'notify_external',
        'notify_external_manager',
        'notify_external_user',
    ];
    protected $dates = ['deleted_at'];
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
        return $this->hasOne(RequestStages::class, 'id', 'to_stage_id');
    }
    public function request_rejected(): HasOne
    {
        return $this->hasOne(RequestStages::class, 'id', 'rejected_id');
    }
    // public function getDynamicToStageIdAttribute()
    // {
    //     // This will be set by the service
    //     return $this->attributes['dynamic_to_stage_id'] ?? $this->to_stage_id;
    // }

    // public function getDynamicRejectedIdAttribute()
    // {
    //     // This will be set by the service
    //     return $this->attributes['dynamic_rejected_id'] ?? $this->rejected_id;
    // }
    public function getDynamicToStageIdAttribute()
    {
        return $this->attributes['dynamic_to_stage_id'] ?? null;
    }

    public function getDynamicRejectedIdAttribute()
    {
        return $this->attributes['dynamic_rejected_id'] ?? null;
    }
}
