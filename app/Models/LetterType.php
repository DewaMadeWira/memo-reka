<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LetterType extends Model
{
    //
    // protected $primaryKey = 'idstatus';
    protected $fillable = [
        'letter_name',
    ];
    // public function approval_type(): BelongsTo
    // {
    //     return $this->belongsTo(ApprovalType::class, 'approval_id', 'id');
    // }
    public function request_stages(): HasMany
    {
        return $this->hasMany(RequestStages::class, 'letter_id', 'id');
    }
    public function memo(): HasMany
    {
        return $this->hasMany(MemoLetter::class, 'letter_id', 'id');
    }
    // public function correction_type(): BelongsTo
    // {
    //     return $this->belongsTo(CorrectionType::class, 'correction_id', 'id');
    // }
}
