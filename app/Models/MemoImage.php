<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class MemoImage extends Model
{
    use SoftDeletes;
    //
    protected $fillable = [
        'memo_letter_id',
        'file_path',
        'file_name',
        'file_type',
        'file_size'
    ];
    protected $dates = ['deleted_at'];
    public function memo(): BelongsTo
    {
        return $this->belongsTo(MemoLetter::class, 'memo_letter_id');
    }
}
