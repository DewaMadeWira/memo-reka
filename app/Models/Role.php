<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Role extends Model
{
    // protected $table = 'role';
    use SoftDeletes;
    protected $primaryKey = 'id';
    protected $fillable = [
        'role_name',
    ];
    protected $dates = ['deleted_at'];
    public function users()
    {
        return $this->hasMany(user::class, 'role_id', 'id');
    }
}
