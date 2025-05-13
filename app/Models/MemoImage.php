<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemoImage extends Model
{
    //
    protected $fillable = [
        'memo_letter_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size'
    ];

    public function memo(): BelongsTo
    {
        return $this->belongsTo(MemoLetter::class, 'memo_letter_id');
    }
}
