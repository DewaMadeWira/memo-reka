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
        'monthly_counter',
        'yearly_counter',
        'perihal',
        'content',
        'signatory',
        'official_id',
        'letter_id',
        'from_division',
        'to_division',
        'file_path',
    ];
    public function from_division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'from_division', 'id');
    }
    public function to_division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'to_division', 'id');
    }
    public function letter(): BelongsTo
    {
        return $this->belongsTo(LetterType::class, 'letter_id', 'id');
    }
    public function signatory(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signatory', 'id');
    }
    public function official_id(): BelongsTo
    {
        return $this->belongsTo(Official::class, 'official_id', 'id');
    }
}
