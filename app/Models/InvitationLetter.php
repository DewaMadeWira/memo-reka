<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InvitationLetter extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        // 'invitation_name',
        'invitation_number',
        'monthly_counter',
        'yearly_counter',
        'letter_id',
        'from_division',
        'to_division',
        'perihal',
        'content',
        'rejection_reason',
        'signatory',
        'official_id',
        'hari_tanggal',
        'waktu',
        'tempat',
        'agenda',
    ];
    public function from_division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'from_division', 'id');
    }
    public function to_division(): BelongsTo
    {
        return $this->belongsTo(Division::class, 'to_division', 'id');
    }
    public function letter(): BelongsTo
    {
        return $this->belongsTo(LetterType::class, 'letter_id', 'id');
    }
    public function signatory(): BelongsTo
    {
        return $this->belongsTo(User::class, 'signatory', 'id');
    }
    public function official_id(): BelongsTo
    {
        return $this->belongsTo(Official::class, 'official_id', 'id');
    }
    public function attendees()
    {
        return $this->hasMany(MeetingAttendees::class);
    }
}
