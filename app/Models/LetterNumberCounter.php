<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LetterNumberCounter extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'division_id',
        'monthly_counter',
        'yearly_counter',
    ];
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'division_id', 'id');
    }
}
