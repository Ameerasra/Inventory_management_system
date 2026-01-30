import { Head, useForm, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Minus, PackagePlus, Search, Trash2, X, ArrowUpDown, ChevronDown, Filter, MoreHorizontal, LayoutGrid, List } from 'lucide-react';
import { useState, useMemo, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

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
    stock_quantity: string | number;
    min_stock_level: string | number;
    is_low_stock: boolean;
}

interface Props {
    items: Item[];
    units: Unit[];
    categories: Category[];
}


// Searchable Item Selector Component
function SearchableItemSelector({
    items,
    value,
    onChange,
    placeholder = "Search product by name or code...",
    className
}: {
    items: Item[],
    value: string,
    onChange: (id: string) => void,
    placeholder?: string,
    className?: string
}) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedItem = items.find(i => i.id.toString() === value);

    const filteredOptions = useMemo(() => {
        if (!search) return items.slice(0, 8);
        return items.filter(i =>
            i.name.toLowerCase().includes(search.toLowerCase()) ||
            i.item_code.toLowerCase().includes(search.toLowerCase())
        ).slice(0, 8);
    }, [items, search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div
                className={cn(
                    "flex h-11 w-full items-center justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm transition-all hover:border-blue-500 focus:ring-2 focus:ring-blue-500/20 cursor-pointer shadow-sm",
                    className
                )}
                onClick={() => setOpen(!open)}
            >
                <span className={cn("font-medium truncate flex-1 text-left", !selectedItem && "text-slate-400 font-normal")}>
                    {selectedItem ? (
                        <span className="flex items-center gap-2">
                            <span className="truncate">{selectedItem.name}</span>
                            <span className="text-[10px] font-black opacity-40 whitespace-nowrap px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                                {selectedItem.stock_quantity}
                            </span>
                        </span>
                    ) : placeholder}
                </span>
                <ChevronDown className="h-4 w-4 text-slate-400 transition-transform duration-200" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
            </div>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute z-50 top-full mt-2 w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="flex items-center border-b border-slate-100 dark:border-slate-800 px-4">
                            <Search className="mr-3 h-4 w-4 text-slate-400" />
                            <input
                                className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-500 font-medium"
                                placeholder="Type to search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <div className="max-h-[280px] overflow-auto p-2">
                            {filteredOptions.length === 0 ? (
                                <div className="py-10 text-center flex flex-col items-center gap-2">
                                    <PackagePlus className="size-8 text-slate-200 dark:text-slate-800" />
                                    <span className="text-sm font-bold text-slate-400 italic">No products matched.</span>
                                </div>
                            ) : (
                                filteredOptions.map((item) => (
                                    <div
                                        key={item.id}
                                        className={cn(
                                            "flex w-full cursor-default select-none items-center rounded-xl py-2.5 px-3 text-sm transition-colors mb-1 last:mb-0",
                                            value === item.id.toString()
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                                : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                                        )}
                                        onClick={() => {
                                            onChange(item.id.toString());
                                            setOpen(false);
                                            setSearch('');
                                        }}
                                    >
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold tracking-tight">{item.name}</span>
                                            <div className="flex items-center gap-2 text-[10px] opacity-70 font-black uppercase tracking-wider">
                                                <span>{item.item_code}</span>
                                                <div className="size-0.5 rounded-full bg-current" />
                                                <span>{item.stock_quantity} in stock</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function InventoryIndex({ items, units, categories }: Props) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isStockModalOpen, setIsStockModalOpen] = useState(false);
    const [isBulkStockModalOpen, setIsBulkStockModalOpen] = useState(false);
    const [stockAction, setStockAction] = useState<'addition' | 'deduction'>('addition');

    const emptyItem = {
        name: '',
        description: '',
        unit_id: '',
        category_id: '',
        initial_stock: 0,
        min_stock_level: 0,
    };

    const emptyBulkTransaction = {
        item_id: '',
        type: 'deduction' as 'addition' | 'deduction',
        quantity: 0,
        notes: '',
    };

    const addItemForm = useForm({
        items: [emptyItem],
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

    const bulkStockForm = useForm({
        transactions: [emptyBulkTransaction],
    });

    const filteredItems = items.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.item_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || item.category_id?.toString() === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const handleAddItemRow = () => {
        addItemForm.setData('items', [...addItemForm.data.items, emptyItem]);
    };

    const handleRemoveItemRow = (index: number) => {
        if (addItemForm.data.items.length > 1) {
            const newItems = addItemForm.data.items.filter((_, i) => i !== index);
            addItemForm.setData('items', newItems);
        }
    };

    const updateItemField = (index: number, field: string, value: string | number) => {
        const newItems = [...addItemForm.data.items];
        newItems[index] = { ...newItems[index], [field]: value };
        addItemForm.setData('items', newItems);
    };

    const handleAddItems = (e: React.FormEvent) => {
        e.preventDefault();
        addItemForm.post(route('inventory.store'), {
            onSuccess: () => {
                setIsAddModalOpen(false);
                addItemForm.reset();
            },
        });
    };

    // Bulk Stock Methods
    const handleAddBulkRow = () => {
        bulkStockForm.setData('transactions', [...bulkStockForm.data.transactions, { ...emptyBulkTransaction }]);
    };

    const handleRemoveBulkRow = (index: number) => {
        if (bulkStockForm.data.transactions.length > 1) {
            const newTransactions = bulkStockForm.data.transactions.filter((_, i) => i !== index);
            bulkStockForm.setData('transactions', newTransactions);
        }
    };

    const updateBulkField = (index: number, field: string, value: string | number) => {
        const newTransactions = [...bulkStockForm.data.transactions];
        newTransactions[index] = { ...newTransactions[index], [field]: value };
        bulkStockForm.setData('transactions', newTransactions);
    };

    const handleBulkStockSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        bulkStockForm.post(route('inventory.bulk-stock.update'), {
            onSuccess: () => {
                setIsBulkStockModalOpen(false);
                bulkStockForm.reset();
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
            min_stock_level: parseFloat(item.min_stock_level.toString()),
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
            <Head title="Inventory Matrix - Global Stock Control" />

            <div className="flex h-full flex-col gap-8 p-6 lg:p-10 bg-slate-50 border-l border-slate-200 dark:bg-slate-950 dark:border-slate-800">
                {/* Header Section */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between animate-in fade-in slide-in-from-top-4 duration-700">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">Inventory Master</h1>
                        <p className="text-slate-500 font-medium">Precision cataloguing and real-time stock orchestration.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Dialog open={isBulkStockModalOpen} onOpenChange={setIsBulkStockModalOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="h-12 px-6 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-800 text-blue-600 font-bold uppercase tracking-wider text-xs">
                                    <ArrowUpDown className="mr-2 h-4 w-4" />
                                    Bulk stock Action
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="min-w-6xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-4xl">
                                <div className="p-8 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Bulk Stock Adjustment</DialogTitle>
                                        <p className="text-sm text-slate-500 font-medium">Add or remove stock for multiple items in one go.</p>
                                    </DialogHeader>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleBulkStockSubmit} className="space-y-8">
                                        <div className="space-y-4">
                                            {bulkStockForm.data.transactions.map((tx, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="relative p-6 border dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-950/50 group"
                                                >
                                                    {bulkStockForm.data.transactions.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveBulkRow(index)}
                                                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    )}

                                                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
                                                        <div className="lg:col-span-4 space-y-2">
                                                            <Label className="text-[11px] font-bold text-slate-500 tracking-wide">SELECT PRODUCT</Label>
                                                            <SearchableItemSelector
                                                                items={items}
                                                                value={tx.item_id}
                                                                onChange={(val) => updateBulkField(index, 'item_id', val)}
                                                                placeholder="Choose product..."
                                                            />
                                                        </div>

                                                        <div className="lg:col-span-2 space-y-2">
                                                            <Label className="text-[11px] font-bold text-slate-500 tracking-wide">ACTION</Label>
                                                            <Select value={tx.type} onValueChange={val => updateBulkField(index, 'type', val as 'addition' | 'deduction')}>
                                                                <SelectTrigger className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-bold focus:ring-2 focus:ring-blue-500/20 transition-all">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                                                    <SelectItem value="addition" className="font-bold text-emerald-600">ADD STOCK</SelectItem>
                                                                    <SelectItem value="deduction" className="font-bold text-red-600">REMOVE STOCK</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        </div>

                                                        <div className="lg:col-span-2 space-y-2">
                                                            <Label className="text-[11px] font-bold text-slate-500 tracking-wide">QUANTITY</Label>
                                                            <Input
                                                                type="number"
                                                                className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 font-black text-blue-600 text-base px-4 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                                value={tx.quantity}
                                                                onChange={e => updateBulkField(index, 'quantity', parseFloat(e.target.value))}
                                                                required
                                                                min="1"
                                                            />
                                                        </div>

                                                        <div className="lg:col-span-4 space-y-2">
                                                            <Label className="text-[11px] font-bold text-slate-500 tracking-wide">NOTES / REASON</Label>
                                                            <Input
                                                                placeholder="Reason for change..."
                                                                className="h-11 rounded-xl bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm px-4 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                                                value={tx.notes}
                                                                onChange={e => updateBulkField(index, 'notes', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col gap-6">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-14 w-full border-dashed border-slate-300 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 font-bold tracking-tight text-slate-500"
                                                onClick={handleAddBulkRow}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Another Item Row
                                            </Button>

                                            <DialogFooter className="bg-slate-50 dark:bg-slate-900/50 p-6 -mx-8 -mb-8 rounded-b-4xl border-t dark:border-slate-800">
                                                <Button type="button" variant="ghost" onClick={() => setIsBulkStockModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                                                <Button type="submit" className="h-12 px-10 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold shadow-xl shadow-blue-500/20" disabled={bulkStockForm.processing}>
                                                    Confirm Stock Update
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="h-12 px-6 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-950 font-bold uppercase tracking-wider text-xs shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
                                    <PackagePlus className="mr-2 h-4 w-4" />
                                    Catalogue New Items
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0 border-none shadow-2xl rounded-4xl">
                                <div className="p-8 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl font-black">Register New Products</DialogTitle>
                                        <p className="text-sm text-slate-500 font-medium">Add new items to your inventory database.</p>
                                    </DialogHeader>
                                </div>
                                <div className="p-8">
                                    <form onSubmit={handleAddItems} className="space-y-6">
                                        {addItemForm.data.items.map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="relative p-6 border dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950/50 space-y-6 group shadow-sm"
                                            >
                                                {addItemForm.data.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveItemRow(index)}
                                                        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 rounded-full hover:bg-red-50"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                )}

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">PRODUCT NAME</Label>
                                                        <Input
                                                            placeholder="e.g. Wireless Mouse"
                                                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800"
                                                            value={item.name}
                                                            onChange={e => updateItemField(index, 'name', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">DESCRIPTION (OPTIONAL)</Label>
                                                        <Input
                                                            placeholder="Short description..."
                                                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800"
                                                            value={item.description}
                                                            onChange={e => updateItemField(index, 'description', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">CATEGORY</Label>
                                                        <Select value={item.category_id} onValueChange={val => updateItemField(index, 'category_id', val)}>
                                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800">
                                                                <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl">
                                                                {categories.map(cat => (
                                                                    <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">UNIT OF MEASURE</Label>
                                                        <Select value={item.unit_id} onValueChange={val => updateItemField(index, 'unit_id', val)}>
                                                            <SelectTrigger className="h-11 rounded-xl border-slate-200 dark:border-slate-800">
                                                                <SelectValue placeholder="Select unit" />
                                                            </SelectTrigger>
                                                            <SelectContent className="rounded-xl">
                                                                {units.map(unit => (
                                                                    <SelectItem key={unit.id} value={unit.id.toString()}>{unit.name}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">INITIAL STOCK</Label>
                                                        <Input
                                                            type="number"
                                                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 font-bold"
                                                            value={item.initial_stock}
                                                            onChange={e => updateItemField(index, 'initial_stock', parseFloat(e.target.value))}
                                                            min="0"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">MINIMUM STOCK ALERT</Label>
                                                        <Input
                                                            type="number"
                                                            className="h-11 rounded-xl border-slate-200 dark:border-slate-800 font-bold"
                                                            value={item.min_stock_level}
                                                            onChange={e => updateItemField(index, 'min_stock_level', parseFloat(e.target.value))}
                                                            min="0"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}

                                        <div className="flex flex-col gap-6 ">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-14 w-full border-dashed border-slate-300 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 font-bold tracking-tight text-slate-500"
                                                onClick={handleAddItemRow}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Another Product
                                            </Button>

                                            <DialogFooter className="bg-slate-50 dark:bg-slate-900/50 p-6 -mx-8 -mb-8 rounded-b-4xl border-t dark:border-slate-800">
                                                <Button type="button" variant="ghost" onClick={() => setIsAddModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                                                <Button type="submit" className="h-12 px-10 rounded-xl bg-slate-900 dark:bg-white dark:text-slate-950 font-bold shadow-2xl" disabled={addItemForm.processing}>
                                                    Save All Products
                                                </Button>
                                            </DialogFooter>
                                        </div>
                                    </form>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Filter & Table Area */}
                <Card className="overflow-hidden border-none shadow-xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem]">
                    <CardHeader className="flex flex-col gap-6 p-8 bg-slate-50/50 dark:bg-slate-950/20 md:flex-row md:items-center md:justify-between border-b dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-500/20">
                                <List className="size-5 text-white" />
                            </div>
                            <CardTitle className="text-xl font-black tracking-tight">Catalog View</CardTitle>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
                            <div className="relative flex-1 min-w-[280px]">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                                <Input
                                    type="search"
                                    placeholder="Search by code or product name..."
                                    className="h-12 pl-11 rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-medium transition-all focus:ring-4 focus:ring-blue-500/10"
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="p-1 px-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-1 shadow-sm">
                                    <Filter className="size-3 text-slate-400" />
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger className="h-9 w-[180px] border-none font-bold text-xs uppercase tracking-widest ring-0 focus:ring-0">
                                            <SelectValue placeholder="All Categories" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                            <SelectItem value="all" className="font-bold">ALL CATEGORIES</SelectItem>
                                            {categories.map(category => (
                                                <SelectItem key={category.id} value={category.id.toString()} className="font-medium">
                                                    {category.name.toUpperCase()}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="flex p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-white dark:bg-slate-900 shadow-sm"><List className="size-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-40"><LayoutGrid className="size-4" /></Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/20">
                                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800">
                                    <TableHead className="w-[120px] font-black uppercase tracking-widest text-[10px] py-6 pl-8">Identity</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Product Information</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Logistics Level</TableHead>
                                    <TableHead className="font-black uppercase tracking-widest text-[10px] py-6">Segment</TableHead>
                                    <TableHead className="text-right font-black uppercase tracking-widest text-[10px] py-6 pr-8">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {filteredItems.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-64 text-center">
                                                <div className="flex flex-col items-center gap-3">
                                                    <Search className="size-12 text-slate-100 dark:text-slate-800" />
                                                    <p className="font-black text-slate-300 dark:text-slate-800 uppercase tracking-[0.2em] italic">No Nodes Detected</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredItems.map((item) => (
                                            <TableRow
                                                key={item.id}
                                                className="group border-slate-50 dark:border-slate-800/50 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors"
                                            >
                                                <TableCell className="pl-8 py-5">
                                                    <span className="font-mono text-xs font-black text-blue-600 bg-blue-50 dark:bg-blue-950/30 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/50">
                                                        {item.item_code}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <Link
                                                            href={`/inventory/${item.id}`}
                                                            className="font-black text-slate-900 dark:text-white hover:text-blue-600 transition-colors leading-tight"
                                                        >
                                                            {item.name}
                                                        </Link>
                                                        <span className="text-xs text-slate-500 font-medium line-clamp-1">{item.description || 'Global Asset Specification'}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <span className={cn(
                                                                "text-sm font-black text-white px-3 py-1 rounded-lg shadow-sm leading-none",
                                                                parseFloat(item.stock_quantity.toString()) <= parseFloat(item.min_stock_level.toString())
                                                                    ? "bg-red-600 shadow-red-500/20"
                                                                    : "bg-emerald-600 shadow-emerald-500/20"
                                                            )}>
                                                                {item.stock_quantity}
                                                            </span>
                                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">{item.unit?.name || 'Units'}</span>
                                                        </div>
                                                        {item.is_low_stock && (
                                                            <div className="inline-flex self-start items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/30 px-2 py-0.5 border border-red-200 dark:border-red-900/50">
                                                                <div className="size-1 bg-red-600 rounded-full animate-ping" />
                                                                <span className="text-[9px] font-black text-red-700 dark:text-red-400 uppercase tracking-widest">Low alert</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        {item.category?.name?.toUpperCase() || 'UNSEGMENTED'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right pr-8">
                                                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 rounded-xl hover:bg-white dark:hover:bg-slate-800 border-none shadow-none"
                                                            onClick={() => openEditModal(item)}
                                                        >
                                                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                                                        </Button>
                                                        <div className="w-px h-9 bg-slate-100 dark:bg-slate-800 mx-1" />
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 rounded-xl text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                                                            onClick={() => openStockModal(item, 'addition')}
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            className="h-9 w-9 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                                            onClick={() => openStockModal(item, 'deduction')}
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Edit & Single Stock Modals - Already professionalized in previous steps but updated for consistency */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                        <div className="p-8 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black italic">Edit Product Details</DialogTitle>
                                <p className="text-sm font-medium text-slate-500">Updating information for {selectedItem?.name}</p>
                            </DialogHeader>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleUpdateItem} className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">PRODUCT NAME</Label>
                                        <Input
                                            className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 font-bold"
                                            value={editItemForm.data.name}
                                            onChange={e => editItemForm.setData('name', e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[11px] font-bold text-slate-500 tracking-wide">DESCRIPTION (OPTIONAL)</Label>
                                        <Input
                                            className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10"
                                            value={editItemForm.data.description}
                                            onChange={e => editItemForm.setData('description', e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-slate-500 tracking-wide">CATEGORY</Label>
                                            <Select
                                                value={editItemForm.data.category_id}
                                                onValueChange={val => editItemForm.setData('category_id', val)}
                                            >
                                                <SelectTrigger className="h-12 rounded-2xl border-slate-200 dark:border-slate-800">
                                                    <SelectValue placeholder="Select segment" />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-2xl">
                                                    {categories.map(category => (
                                                        <SelectItem key={category.id} value={category.id.toString()} className="font-bold">
                                                            {category.name.toUpperCase()}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-[11px] font-bold text-slate-500 tracking-wide">MINIMUM STOCK ALERT</Label>
                                            <Input
                                                type="number"
                                                className="h-12 rounded-2xl border-slate-200 dark:border-slate-800 focus:ring-4 focus:ring-blue-500/10 font-black text-blue-600"
                                                value={editItemForm.data.min_stock_level}
                                                onChange={e => editItemForm.setData('min_stock_level', parseFloat(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <DialogFooter className="bg-slate-50 dark:bg-slate-900/50 p-6 -mx-8 -mb-8 mt-10 border-t dark:border-slate-800">
                                    <Button type="button" variant="ghost" onClick={() => setIsEditModalOpen(false)} className="rounded-xl font-bold">Cancel</Button>
                                    <Button type="submit" className="h-12 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 font-bold shadow-xl shadow-blue-500/20" disabled={editItemForm.processing}>
                                        Commit Changes
                                    </Button>
                                </DialogFooter>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>

                <Dialog open={isStockModalOpen} onOpenChange={setIsStockModalOpen}>
                    <DialogContent className="rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden max-w-[400px]">
                        <div className={cn(
                            "p-8 text-center border-b",
                            stockAction === 'addition' ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/50" : "bg-red-50/50 dark:bg-red-950/20 border-red-100 dark:border-red-900/50"
                        )}>
                            <div className={cn(
                                "size-16 rounded-3xl mx-auto mb-4 flex items-center justify-center shadow-2xl",
                                stockAction === 'addition' ? "bg-emerald-600 text-white shadow-emerald-500/20" : "bg-red-600 text-white shadow-red-500/20"
                            )}>
                                {stockAction === 'addition' ? <PackagePlus className="size-8" /> : <Trash2 className="size-8" />}
                            </div>
                            <DialogHeader>
                                <DialogTitle className="text-xl font-black">
                                    {stockAction === 'addition' ? 'Augment' : 'Liquidate'} Stock
                                </DialogTitle>
                                <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{selectedItem?.name}</p>
                            </DialogHeader>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleUpdateStock} className="space-y-8">
                                <div className="space-y-2">
                                    <Label className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 text-center block">Quantity Magnitude</Label>
                                    <div className="relative">
                                        <Input
                                            id="stock_quantity"
                                            type="number"
                                            className="h-20 text-center text-4xl font-black rounded-3xl border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-0 focus:border-blue-500"
                                            value={stockForm.data.quantity}
                                            onChange={e => stockForm.setData('quantity', parseFloat(e.target.value))}
                                            required
                                        />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black uppercase text-slate-400">{selectedItem?.unit?.name}</span>
                                    </div>
                                    {stockForm.errors.quantity && <p className="text-center text-xs text-red-500 font-black italic">{stockForm.errors.quantity}</p>}
                                </div>
                                <div className="space-y-2 px-4">
                                    <Label className="uppercase tracking-[0.2em] text-[10px] font-black opacity-50 block">Audit Log Reference</Label>
                                    <Input
                                        id="notes"
                                        className="h-10 rounded-xl border-slate-100 dark:border-slate-800 bg-transparent text-center text-sm"
                                        value={stockForm.data.notes}
                                        onChange={e => stockForm.setData('notes', e.target.value)}
                                        placeholder="Reason for change..."
                                    />
                                </div>

                                <div className="flex flex-col gap-2 pt-4">
                                    <Button
                                        type="submit"
                                        className={cn(
                                            "h-14 rounded-3xl text-base font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95",
                                            stockAction === 'addition' ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20' : 'bg-red-600 hover:bg-red-500 shadow-red-500/20'
                                        )}
                                        disabled={stockForm.processing}
                                    >
                                        Execute {stockAction === 'addition' ? 'Inbound' : 'Outbound'}
                                    </Button>
                                    <Button type="button" variant="ghost" className="rounded-2xl font-bold text-slate-400" onClick={() => setIsStockModalOpen(false)}>Cancel</Button>
                                </div>
                            </form>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout >
    );
}

// Mock route function if not defined in windows environment
const route = (window as Window & { route?: (name: string, params?: string | number | object) => string }).route || ((name: string, params?: string | number | object) => {
    if (name === 'inventory.store') return '/inventory';
    if (name === 'inventory.stock.update') return `/inventory/${params}/stock`;
    if (name === 'inventory.bulk-stock.update') return '/inventory/bulk-stock';
    if (name === 'inventory.update') return `/inventory/${params}`;
    if (name === 'inventory.show') return `/inventory/${params}`;
    return '#';
});
