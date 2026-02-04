<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuoteRequestItem extends Model
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
        'converted_order_id',
        'converted_at',
    ];
    
    protected $casts = [
        'unit_price_snapshot' => 'decimal:2',
        'line_total_snapshot' => 'decimal:2',
        'admin_unit_price' => 'decimal:2',
        'admin_line_total' => 'decimal:2',
    ];
    
    public function convertedOrder()
    {
        return $this->belongsTo(\App\Models\Order::class, 'converted_order_id');
    }
    

    public function quoteRequest()
    {
        return $this->belongsTo(QuoteRequest::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
