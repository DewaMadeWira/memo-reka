<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    // protected $table = 'role';
    protected $primaryKey = 'id';
    protected $fillable = [
        'roleName',
    ];
    public function users()
    {
        return $this->hasMany(user::class, 'role_id', 'id');
    }
}
