<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvitedUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_pengguna',
        'division_id',
        'official_id',
    ];

    /**
     * Get the division that the invited user belongs to.
     */
    public function division(): BelongsTo
    {
        return $this->belongsTo(Division::class);
    }

    /**
     * Get the official that the invited user belongs to.
     */
    public function official(): BelongsTo
    {
        return $this->belongsTo(Official::class);
    }
}
