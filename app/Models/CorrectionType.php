<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CorrectionType extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'correction_name'
    ];
}
