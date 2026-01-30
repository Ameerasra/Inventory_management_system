<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Category;
use App\Models\InventoryTransaction;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // 1. Total Items & Active Stock
        $totalItems = Item::count();
        $totalStock = Item::sum('stock_quantity');
        
        // 2. Low Stock Count
        $lowStockCount = Item::whereRaw('stock_quantity <= min_stock_level')->count();

        // 3. Stock by Category (for Bar Chart)
        $stockByCategory = Category::withSum('items', 'stock_quantity')
            ->get()
            ->map(function ($category) {
                return [
                    'name' => $category->name,
                    'stock' => (float) ($category->items_sum_stock_quantity ?? 0)
                ];
            });

        // 4. Warehouse Capacity Simulation (or just use 10000 as a base if no real capacity field exists)
        $totalCapacity = 10000; // Mock Max capacity
        $usedPercentage = $totalCapacity > 0 ? min(100, round(($totalStock / $totalCapacity) * 100)) : 0;

        // 5. Recent Transaction Trends (for Area Chart)
        // Group by day for the last 7 days
        $last7Days = collect(range(6, 0))->map(function ($daysAgo) {
            $date = now()->subDays($daysAgo)->format('Y-m-d');
            $additions = InventoryTransaction::whereDate('created_at', $date)->where('type', 'addition')->sum('quantity');
            $deductions = InventoryTransaction::whereDate('created_at', $date)->where('type', 'deduction')->sum('quantity');
            
            return [
                'day' => now()->subDays($daysAgo)->format('D'),
                'additions' => (float)$additions,
                'deductions' => (float)$deductions,
            ];
        });

        // 6. Categories Data (for some extra visualization if needed)
        $categoriesCount = Category::count();

        return Inertia::render('dashboard', [
            'stats' => [
                'totalItems' => (int) $totalItems,
                'totalStock' => (float) ($totalStock ?? 0),
                'lowStockCount' => (int) $lowStockCount,
                'usedPercentage' => (float) $usedPercentage,
                'totalCategories' => (int) $categoriesCount,
            ],
            'charts' => [
                'stockByCategory' => $stockByCategory,
                'transactionHistory' => $last7Days,
                'capacityData' => [
                    ['name' => 'Used Space', 'value' => (float)$usedPercentage, 'color' => '#2563eb'],
                    ['name' => 'Free Space', 'value' => (float)(100 - $usedPercentage), 'color' => '#e5e7eb'],
                ]
            ]
        ]);
    }
}
