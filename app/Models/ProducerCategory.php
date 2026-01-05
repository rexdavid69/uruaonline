<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProducerCategory extends Model
{
    use HasFactory;

    protected $fillable = ['producer_id', 'category_id', 'name', 'slug', 'parent_id'];

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
