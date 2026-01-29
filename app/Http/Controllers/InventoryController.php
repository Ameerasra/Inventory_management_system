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
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'unit_id' => 'required|exists:units,id',
            'category_id' => 'required|exists:categories,id',
            'initial_stock' => 'required|numeric|min:0',
            'min_stock_level' => 'nullable|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            $item = Item::create([
                'name' => $validated['name'],
                'description' => $validated['description'],
                'unit_id' => $validated['unit_id'],
                'category_id' => $validated['category_id'],
                'stock_quantity' => $validated['initial_stock'],
                'min_stock_level' => $validated['min_stock_level'] ?? 0,
            ]);

            if ($validated['initial_stock'] > 0) {
                InventoryTransaction::create([
                    'item_id' => $item->id,
                    'type' => 'addition',
                    'quantity' => $validated['initial_stock'],
                    'notes' => 'Initial stock',
                ]);
            }
        });

        return redirect()->back()->with('success', 'Item created successfully.');
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

    public function history()
    {
        return Inertia::render('inventory/history', [
            'transactions' => InventoryTransaction::with('item.unit')
                ->latest()
                ->paginate(20),
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
