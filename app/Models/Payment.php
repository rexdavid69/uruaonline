<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'reference',
        'amount',
        'status',
        'method',
        'transaction_data',
    ];

    protected $casts = [
        'transaction_data' => 'array',
    ];

    // 🧩 Relationships
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
