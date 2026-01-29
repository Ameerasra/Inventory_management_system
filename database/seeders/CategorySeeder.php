<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Raw Materials',
            'Finished Goods',
            'Stationery & Office Supplies',
            'Consumables',
            'Tools & Equipment',
            'Electrical & Electronics',
            'Food & Beverages',
            'Medical & Safety Supplies',
            'Maintenance & Repair',
            'Miscellaneous',
        ];

        foreach ($categories as $category) {
            \App\Models\Category::firstOrCreate(['name' => $category]);
        }
    }
}
