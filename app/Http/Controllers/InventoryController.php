<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\Unit;
use App\Models\Category;
use App\Models\InventoryTransaction;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    public function index()
    {
        return Inertia::render('inventory/index', [
            'items' => Item::with(['unit', 'category'])->orderBy('id', 'asc')->get(),
            'units' => Unit::all(),
            'categories' => Category::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.name' => 'required|string|max:255',
            'items.*.description' => 'nullable|string',
            'items.*.unit_id' => 'required|exists:units,id',
            'items.*.category_id' => 'required|exists:categories,id',
            'items.*.initial_stock' => 'required|numeric|min:0',
            'items.*.min_stock_level' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $itemData) {
                $item = Item::create([
                    'name' => $itemData['name'],
                    'description' => $itemData['description'],
                    'unit_id' => $itemData['unit_id'],
                    'category_id' => $itemData['category_id'],
                    'stock_quantity' => $itemData['initial_stock'],
                    'min_stock_level' => $itemData['min_stock_level'] ?? 0,
                ]);

                if ($itemData['initial_stock'] > 0) {
                    InventoryTransaction::create([
                        'item_id' => $item->id,
                        'type' => 'addition',
                        'quantity' => $itemData['initial_stock'],
                        'notes' => 'Initial stock',
                    ]);
                }
            }
        });

        return redirect()->back()->with('success', count($validated['items']) . ' items created successfully.');
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category_id' => 'required|exists:categories,id',
            'min_stock_level' => 'required|numeric|min:0',
        ]);

        $item->update($validated);

        return redirect()->back()->with('success', 'Item updated successfully.');
    }

    public function updateStock(Request $request, Item $item)
    {
        $validated = $request->validate([
            'type' => 'required|in:addition,deduction',
            'quantity' => 'required|numeric|min:0.01',
            'notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($item, $validated) {
            if ($validated['type'] === 'deduction' && $item->stock_quantity < $validated['quantity']) {
                throw \Illuminate\Validation\ValidationException::withMessages([
                    'quantity' => 'Insufficient stock for this deduction.',
                ]);
            }

            $multiplier = $validated['type'] === 'addition' ? 1 : -1;
            $item->increment('stock_quantity', $multiplier * $validated['quantity']);

            InventoryTransaction::create([
                'item_id' => $item->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'notes' => $validated['notes'],
            ]);
        });

        return redirect()->back()->with('success', 'Stock updated successfully.');
    }

    public function bulkUpdateStock(Request $request)
    {
        $validated = $request->validate([
            'transactions' => 'required|array|min:1',
            'transactions.*.item_id' => 'required|exists:items,id',
            'transactions.*.type' => 'required|in:addition,deduction',
            'transactions.*.quantity' => 'required|numeric|min:0.01',
            'transactions.*.notes' => 'nullable|string',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['transactions'] as $transactionData) {
                $item = Item::lockForUpdate()->find($transactionData['item_id']);

                if ($transactionData['type'] === 'deduction' && $item->stock_quantity < $transactionData['quantity']) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'transactions.' . array_search($transactionData, $validated['transactions']) . '.quantity' => "Insufficient stock for {$item->name}.",
                    ]);
                }

                $multiplier = $transactionData['type'] === 'addition' ? 1 : -1;
                $item->increment('stock_quantity', $multiplier * $transactionData['quantity']);

                InventoryTransaction::create([
                    'item_id' => $item->id,
                    'type' => $transactionData['type'],
                    'quantity' => $transactionData['quantity'],
                    'notes' => $transactionData['notes'],
                ]);
            }
        });

        return redirect()->back()->with('success', 'Bulk stock update completed.');
    }

    public function history(Request $request)
    {
        $search = $request->input('search');

        $transactions = InventoryTransaction::with('item.unit')
            ->when($search, function ($query, $search) {
                $query->whereHas('item', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                    
                    // Handle ITMxxxx search or direct numeric ID search
                    $numericSearch = str_ireplace('itm', '', $search);
                    if (is_numeric($numericSearch)) {
                        $q->orWhere('id', (int)$numericSearch);
                    }
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('inventory/history', [
            'transactions' => $transactions,
            'filters' => [
                'search' => $search
            ]
        ]);
    }

    public function show(Item $item)
    {
        return Inertia::render('inventory/show', [
            'item' => $item->load('unit'),
            'transactions' => $item->transactions()
                ->with('item.unit')
                ->latest()
                ->paginate(15),
        ]);
    }
}
