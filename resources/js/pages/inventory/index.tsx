import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, PackagePlus, Search } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Unit {
    id: number;
    name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Item {
    id: number;
    item_code: string;
    name: string;
    description: string | null;
    unit_id: number;
    unit: Unit;
    category_id: number | null;
    category: Category | null;
    stock_quantity: string;
    min_stock_level: string;
    is_low_stock: boolean;
}

interface Props {
    items: Item[];
    units: Unit[];
    categories: Category[];
}

export default function InventoryIndex({ items, units, categories }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [stockAction, setStockAction] = useState<'addition' | 'deduction'>('addition');

    const addItemForm = useForm({
        name: '',
        description: '',
        unit_id: '',
        category_id: '',
        initial_stock: 0,
        min_stock_level: 0,
    });

    const editItemForm = useForm({
        name: '',
        description: '',
        category_id: '',
        min_stock_level: 0,
    });

    const stockForm = useForm({
        type: 'addition' as 'addition' | 'deduction',
        quantity: 0,
        notes: '',
    });

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category_id?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        addItemForm.post(route('inventory.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                addItemForm.reset();
            },
        });
    };



    const handleUpdateItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        editItemForm.put(route('inventory.update', selectedItem.id), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                editItemForm.reset();
                setSelectedItem(null);
            },
        });
    };

    const openEditModal = (item: Item) => {
        setSelectedItem(item);
        editItemForm.setData({
            name: item.name,
            description: item.description || '',
            category_id: item.category_id?.toString() || '',
            min_stock_level: parseFloat(item.min_stock_level),
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateStock = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedItem) return;

        stockForm.post(route('inventory.stock.update', selectedItem.id), {
            onSuccess: () => {
                setIsStockModalOpen(false);
                stockForm.reset();
            },
        });
    };

    const openStockModal = (item: Item, action: 'addition' | 'deduction') => {
        setSelectedItem(item);
        setStockAction(action);
        stockForm.setData('type', action);
        setIsStockModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventory', href: '/inventory' }]}>
            <Head title="Inventory" />

            <div className="flex h-full flex-col gap-4 p-4 lg:p-8">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Inventory Management</h1>

                    <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90">
                                <PackagePlus className="mr-2 h-4 w-4" />
                                Add New Item
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Inventory Item</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddItem} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Item Name</Label>
                                    <Input
                                        id="name"
                                        value={addItemForm.data.name}
                                        onChange={e => addItemForm.setData('name', e.target.value)}
                                        required
                                    />
                                    {addItemForm.errors.name && <p className="text-xs text-red-500">{addItemForm.errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={addItemForm.data.description}
                                        onChange={e => addItemForm.setData('description', e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit of Measurement</Label>
                                    <Select value={addItemForm.data.unit_id} onValueChange={val => addItemForm.setData('unit_id', val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {units.map(unit => (
                                                <SelectItem key={unit.id} value={unit.id.toString()}>{unit.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {addItemForm.errors.unit_id && <p className="text-xs text-red-500">{addItemForm.errors.unit_id}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="initial_stock">Initial Stock</Label>
                                    <Input
                                        id="initial_stock"
                                        type="number"
                                        step="0.01"
                                        value={addItemForm.data.initial_stock}
                                        onChange={e => addItemForm.setData('initial_stock', parseFloat(e.target.value))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="min_stock_level">Minimum Stock Level</Label>
                                    <Input
                                        id="min_stock_level"
                                        type="number"
                                        step="0.01"
                                        value={addItemForm.data.min_stock_level}
                                        onChange={e => addItemForm.setData('min_stock_level', parseFloat(e.target.value))}
                                        placeholder="Alert when stock is below..."
                                    />
                                </div>
                                <DialogFooter>
                                    <Button type="submit" disabled={addItemForm.processing}>Create Item</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="overflow-hidden border-none shadow-sm ring-1 ring-black/5 dark:ring-white/10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 bg-muted/30 p-4">
                        <CardTitle className="text-base font-medium">All Items</CardTitle>
                        <div className="flex w-full max-w-sm items-center gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search items..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    {categories.map(category => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">ID</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead className="hidden md:table-cell">Description</TableHead>
                                    <TableHead>Stock</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Unit</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredItems.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No items found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                {item.item_code}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <Link
                                                    href={`/inventory/${item.id}`}
                                                    className="hover:text-blue-500 transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">{item.description}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(
                                                        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                                                        parseFloat(item.stock_quantity) <= 5 ? "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                                    )}>
                                                        {item.stock_quantity}
                                                    </span>
                                                    {item.is_low_stock && (
                                                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-bold text-red-800 ring-1 ring-inset ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20">
                                                            Low Stock
                                                        </span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>{item.category?.name || '-'}</TableCell>
                                            <TableCell>{item.unit.name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => openEditModal(item)}
                                                    >
                                                        <span className="sr-only">Edit</span>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                                            <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                                                            <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                                                        </svg>
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                                                        onClick={() => openStockModal(item, 'addition')}
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                                        onClick={() => openStockModal(item, 'deduction')}
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Item: {selectedItem?.name}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateItem} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-name">Item Name</Label>
                                <Input
                                    id="edit-name"
                                    value={editItemForm.data.name}
                                    onChange={e => editItemForm.setData('name', e.target.value)}
                                    required
                                />
                                {editItemForm.errors.name && <p className="text-xs text-red-500">{editItemForm.errors.name}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-description">Description</Label>
                                <Input
                                    id="edit-description"
                                    value={editItemForm.data.description}
                                    onChange={e => editItemForm.setData('description', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-category">Category</Label>
                                <Select
                                    value={editItemForm.data.category_id}
                                    onValueChange={val => editItemForm.setData('category_id', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(category => (
                                            <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {editItemForm.errors.category_id && <p className="text-xs text-red-500">{editItemForm.errors.category_id}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit-min_stock_level">Minimum Stock Level</Label>
                                <Input
                                    id="edit-min_stock_level"
                                    type="number"
                                    step="0.01"
                                    value={editItemForm.data.min_stock_level}
                                    onChange={e => editItemForm.setData('min_stock_level', parseFloat(e.target.value))}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editItemForm.processing}>Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>

                <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                {stockAction === 'addition' ? 'Add Stock' : 'Deduct Stock'}: {selectedItem?.name}
                            </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpdateStock} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="stock_quantity">Quantity ({selectedItem?.unit.name})</Label>
                                <Input
                                    id="stock_quantity"
                                    type="number"
                                    step="0.01"
                                    value={stockForm.data.quantity}
                                    onChange={e => stockForm.setData('quantity', parseFloat(e.target.value))}
                                    required
                                />
                                {stockForm.errors.quantity && <p className="text-xs text-red-500">{stockForm.errors.quantity}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Input
                                    id="notes"
                                    value={stockForm.data.notes}
                                    onChange={e => stockForm.setData('notes', e.target.value)}
                                    placeholder="Optional reason for change"
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="submit"
                                    className={stockAction === 'addition' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                                    disabled={stockForm.processing}
                                >
                                    Confirm {stockAction === 'addition' ? 'Addition' : 'Deduction'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout >
    );
}

// Mock route function if not defined in windows environment
const route = (window as any).route || ((name: string, params?: any) => {
    if (name === 'inventory.store') return '/inventory';
    if (name === 'inventory.stock.update') return `/inventory/${params}/stock`;
    if (name === 'inventory.update') return `/inventory/${params}`;
    if (name === 'inventory.show') return `/inventory/${params}`;
    return '#';
});
