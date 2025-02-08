<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CorrectionType extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'correction_name'
    ];
    public function letter_type(): HasMany
    {
        return $this->hasMany(ApprovalType::class, 'correction_id', 'id');
    }
}
