<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MemoLetter extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'memo_number',
        'letter_id',
        'from_division',
        'to_division',
    ];
    public function from_division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'from_division', 'id');
    }
    public function to_division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'from_division', 'id');
    }
    public function letter(): BelongsTo
    {
        return $this->belongsTo(LetterType::class, 'letter_id', 'id');
    }
}
