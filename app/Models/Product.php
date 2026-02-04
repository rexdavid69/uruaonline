<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
        'image',
        'producer_id',
        'category_id',
        'producer_category_id',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function tags()
    {
        return $this->belongsToMany(Tag::class);
    }

    public function producer()
    {
        return $this->belongsTo(Producer::class);
    }
    public function specifications()
    {
        return $this->hasMany(ProductSpecification::class);
    }
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function producerCategory()
    {
        return $this->belongsTo(ProducerCategory::class);
    }
    public function subcategory()
{
    return $this->belongsTo(Subcategory::class);
}

public function features()
{
    return $this->hasMany(ProductFeatures::class);
}

}
