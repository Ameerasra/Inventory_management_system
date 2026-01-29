import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowLeft, Package } from 'lucide-react';

interface Transaction {
    id: number;
    item_id: number;
    type: 'addition' | 'deduction';
    quantity: string;
    notes: string | null;
    created_at: string;
}

interface Item {
    id: number;
    item_code: string;
    name: string;
    description: string | null;
    stock_quantity: string;
    is_low_stock: boolean;
    unit: {
        name: string;
    };
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    item: Item;
    transactions: {
        data: Transaction[];
        links: PaginationLinks[];
    };
}

export default function ItemHistory({ item, transactions }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventory', href: '/inventory' },
            { title: item.name, href: `/inventory/${item.id}` }
        ]}>
            <Head title={`${item.name} - History`} />

            <div className="flex h-full flex-col gap-6 p-4 lg:p-8">
                <div className="flex items-center gap-4">
                    <Link
                        href="/inventory"
                        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-white"
                    >
                        <ArrowLeft className="size-5" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                {item.item_code}
                            </span>
                            <h1 className="text-2xl font-bold tracking-tight text-white">{item.name}</h1>
                        </div>
                        <p className="text-muted-foreground text-sm">{item.description || 'No description provided.'}</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none shadow-sm ring-1 ring-black/5 dark:ring-white/10 overflow-hidden bg-muted/20">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Stock</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-4">
                                <div className="flex items-baseline gap-2">
                                    <span className={cn(
                                        "text-4xl font-extrabold",
                                        item.is_low_stock ? "text-red-600 dark:text-red-400" : "text-green-700 dark:text-green-400"
                                    )}>
                                        {item.stock_quantity}
                                    </span>
                                    <span className="text-sm font-medium text-muted-foreground">{item.unit.name}</span>
                                </div>
                                {item.is_low_stock && (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-800 ring-1 ring-inset ring-red-600/20 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20 animate-pulse">
                                        Low Stock
                                    </span>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-none shadow-sm ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <Package className="size-4 text-blue-400" />
                            <CardTitle className="text-sm font-semibold">Transaction Logs</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="hidden md:table-cell text-right">Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                            No transaction history found for this item.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="text-sm font-mono whitespace-nowrap text-muted-foreground">
                                                {new Date(tx.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "inline-flex items-center rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                                    tx.type === 'addition'
                                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                                                )}>
                                                    {tx.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-bold text-black">
                                                {tx.type === 'addition' ? '+' : '-'}{tx.quantity} {item.unit.name}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-right text-muted-foreground italic text-sm">
                                                {tx.notes || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {transactions.links.length > 3 && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        {transactions.links.map((link, i) => (
                            <Link
                                key={i}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={cn(
                                    "px-4 py-2 text-xs font-bold rounded-lg transition-all border",
                                    link.active
                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
                                        : "bg-muted/50 border-white/5 text-muted-foreground hover:bg-muted hover:text-white",
                                    !link.url && "opacity-30 pointer-events-none cursor-not-allowed"
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
