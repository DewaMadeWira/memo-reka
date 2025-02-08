<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ApprovalType extends Model
{
    //
    protected $primaryKey = 'id';
    protected $fillable = [
        'approval_name'
    ];
    public function letter_type(): HasMany
    {
        return $this->hasMany(ApprovalType::class, 'approval_id', 'id');
    }
}
