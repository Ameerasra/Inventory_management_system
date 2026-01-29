import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface Transaction {
    id: number;
    item_id: number;
    type: 'addition' | 'deduction';
    quantity: string;
    notes: string | null;
    created_at: string;
    item: {
        item_code: string;
        name: string;
        unit: {
            name: string;
        };
    };
}

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    transactions: {
        data: Transaction[];
        links: PaginationLinks[];
    };
}

export default function InventoryHistory({ transactions }: Props) {
    return (
        <AppLayout breadcrumbs={[{ title: 'History', href: '/inventory/history' }]}>
            <Head title="Inventory History" />

            <div className="flex h-full flex-col gap-4 p-4 lg:p-8">
                <h1 className="text-2xl font-bold tracking-tight text-white mb-2">Transaction History</h1>

                <Card className="border-none shadow-sm ring-1 ring-black/5 dark:ring-white/10 overflow-hidden">
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="text-base font-medium">Log Records</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date & Time</TableHead>
                                    <TableHead>Item ID</TableHead>
                                    <TableHead>Item Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead className="hidden md:table-cell">Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                            No transactions recorded yet.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.data.map((tx) => (
                                        <TableRow key={tx.id}>
                                            <TableCell className="text-sm font-mono whitespace-nowrap">
                                                {new Date(tx.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                                {tx.item.item_code}
                                            </TableCell>
                                            <TableCell className="font-medium">{tx.item.name}</TableCell>
                                            <TableCell>
                                                <span className={cn(
                                                    "inline-flex items-center rounded-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                                                    tx.type === 'addition' ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300" : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                                                )}>
                                                    {tx.type}
                                                </span>
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {tx.type === 'addition' ? '+' : '-'}{tx.quantity} {tx.item.unit.name}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground italic text-sm">
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
                <div className="flex items-center justify-center gap-2 mt-4">
                    {transactions.links.map((link, i) => (
                        <button
                            key={i}
                            disabled={!link.url}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={cn(
                                "px-3 py-1 text-sm rounded-md transition-all",
                                link.active ? "bg-blue-600 text-white font-bold" : "bg-muted text-muted-foreground hover:bg-muted/80",
                                !link.url && "opacity-50 cursor-not-allowed"
                            )}
                            onClick={() => {
                                if (link.url) window.location.href = link.url;
                            }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
