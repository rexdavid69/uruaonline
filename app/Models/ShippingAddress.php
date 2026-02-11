<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'full_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'country',
    ];

   public function order()
    {
        return $this->belongsTo(\App\Models\Order::class);
    }
}
