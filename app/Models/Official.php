<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Official extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'official_name',
        'official_code',
    ];
    public function memo(): HasMany
    {
        return $this->hasMany(MemoLetter::class, 'official_id', 'id');
    }
}
