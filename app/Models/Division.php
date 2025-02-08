<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Division extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'division_name',
    ];
    public function users()
    {
        return $this->hasMany(user::class, 'division_id', 'id');
    }
    public function from_division(): HasMany
    {
        return $this->hasMany(MemoLetter::class, 'from_division', 'id');
    }
    public function to_division(): HasMany
    {
        return $this->hasMany(MemoLetter::class, 'to_division', 'id');
    }
}
