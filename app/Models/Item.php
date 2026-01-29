<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    protected $fillable = ['name', 'description', 'unit_id', 'stock_quantity', 'min_stock_level', 'category_id'];

    protected $appends = ['item_code', 'is_low_stock'];

    protected function getItemCodeAttribute(): string
    {
        return 'ITM' . str_pad($this->id, 4, '0', STR_PAD_LEFT);
    }

    protected function getIsLowStockAttribute(): bool
    {
        return $this->stock_quantity <= $this->min_stock_level;
    }

    public function unit(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function category(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function transactions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InventoryTransaction::class);
    }
}
