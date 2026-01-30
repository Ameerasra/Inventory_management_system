<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('/dashboard', [App\Http\Controllers\DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/inventory', [App\Http\Controllers\InventoryController::class, 'index'])->name('inventory.index');
    Route::post('/inventory', [App\Http\Controllers\InventoryController::class, 'store'])->name('inventory.store');
    Route::post('/inventory/{item}/stock', [App\Http\Controllers\InventoryController::class, 'updateStock'])->name('inventory.stock.update');
    Route::post('/inventory/bulk-stock', [App\Http\Controllers\InventoryController::class, 'bulkUpdateStock'])->name('inventory.bulk-stock.update');
    Route::get('/inventory/history', [App\Http\Controllers\InventoryController::class, 'history'])->name('inventory.history');
    Route::put('/inventory/{item}', [App\Http\Controllers\InventoryController::class, 'update'])->name('inventory.update');
    Route::get('/inventory/{item}', [App\Http\Controllers\InventoryController::class, 'show'])->name('inventory.show');
});

require __DIR__.'/settings.php';
