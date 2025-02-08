<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ApprovalType extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'approval_name'
    ];
    
}
