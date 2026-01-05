<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Producer extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description', 'logo']; //

    public function products()
    {
        return $this->hasMany(Product::class);
    }
    public function producerCategories()
    {
        return $this->hasMany(ProducerCategory::class);
    }
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'producer_categories', 'producer_id', 'category_id')
            ->withTimestamps();
    }

}
