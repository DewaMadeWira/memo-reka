<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SummaryLetter extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'invitation_id',
        'file_path',
    ];
    public function invitation(): BelongsTo
    {
        return $this->belongsTo(InvitationLetter::class, 'invitation_id', 'id');
    }
}
