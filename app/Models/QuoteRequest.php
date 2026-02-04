<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequest extends Model
{
    protected $fillable = [
        'user_id',
        'full_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
        'notes',
        'priced_total_snapshot',
        'status',
    ];

    public function items()
    {
        return $this->hasMany(QuoteRequestItem::class);
    }

    public function user()
{
    return $this->belongsTo(User::class);
}

}
