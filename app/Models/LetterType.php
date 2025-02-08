<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterType extends Model
{
    //
    protected $primaryKey = 'idstatus';
    protected $fillable = [
        'letter_name',
        'approval_id',
    ];
    public function approval_type(): BelongsTo
    {
        return $this->belongsTo(ApprovalType::class, 'approval_id', 'id');
    }
    public function correction_type(): BelongsTo
    {
        return $this->belongsTo(CorrectionType::class, 'correction_id', 'id');
    }
}
