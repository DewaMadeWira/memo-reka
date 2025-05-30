<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfficialInvited extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'official_invited';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'official_name',
        'official_code',
    ];

    /**
     * Get the invited users associated with this official.
     */
    public function invitedUsers()
    {
        return $this->hasMany(InvitedUser::class, 'official_id');
    }
}
