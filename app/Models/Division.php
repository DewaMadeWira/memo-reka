<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
}
