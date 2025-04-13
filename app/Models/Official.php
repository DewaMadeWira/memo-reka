<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Official extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'official_name',
        'official_code',
    ];
}
