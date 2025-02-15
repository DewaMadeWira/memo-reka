<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RequestStatus extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'status_name',
    ];
    public function request_stages()
    {
        return $this->hasMany(RequestStages::class, 'status_id', 'id');
    }
}
