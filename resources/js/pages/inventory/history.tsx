import { Head, router, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft, FileText, Search, Filter, Package } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

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
        current_page: number;
        last_page: number;
        total: number;
    };
    filters: {
        search: string | null;
    };
}


const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function InventoryHistory({ transactions, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [prevSearch, setPrevSearch] = useState(filters.search);

    if (filters.search !== prevSearch) {
        setSearchTerm(filters.search || '');
        setPrevSearch(filters.search);
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchTerm !== (filters.search || '')) {
                router.get('/inventory/history',
                    { search: searchTerm },
                    {
                        preserveState: true,
                        replace: true,
                        preserveScroll: true
                    }
                );
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, filters.search]);

    return (
        <AppLayout breadcrumbs={[{ title: 'History', href: '/inventory/history' }]}>
            <Head title="Inventory Audit Logs" />

            <div className="flex h-full flex-col gap-8 p-6 lg:p-10 bg-[#f8fafc] dark:bg-[#0a0a0b]">
                {/* Header */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="h-1 w-8 bg-blue-600 rounded-full" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/70">Audit Trail</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white flex items-center gap-3">
                            Inventory History
                            <div className="flex items-center justify-center size-8 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm">
                                {transactions.total}
                            </div>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative w-full lg:w-80 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                            <Input
                                placeholder="Filter by item or code..."
                                className="h-12 pl-12 pr-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 font-medium transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center justify-center size-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <Filter className="size-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <Card className="border-none shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 overflow-hidden bg-white dark:bg-[#0d0d0f] rounded-[2.5rem]">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40">
                                    <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800/60">
                                        <TableHead className="w-[200px] py-6 pl-8 font-black uppercase tracking-widest text-[10px] text-slate-500">Timestamp</TableHead>
                                        <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-slate-500">Identity / Origin</TableHead>
                                        <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-slate-500">Operation</TableHead>
                                        <TableHead className="py-6 font-black uppercase tracking-widest text-[10px] text-slate-500 text-center">Magnitude</TableHead>
                                        <TableHead className="py-6 pr-8 font-black uppercase tracking-widest text-[10px] text-slate-500">Audit Notes</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <AnimatePresence mode="popLayout">
                                        {transactions.data.map((tx, idx) => (
                                            <motion.tr
                                                key={tx.id}
                                                variants={item}
                                                initial="hidden"
                                                animate="show"
                                                transition={{ delay: idx * 0.03 }}
                                                className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/40 border-slate-100 dark:border-slate-800/60 transition-colors cursor-pointer"
                                                onClick={() => router.visit(`/inventory/${tx.item_id}`)}
                                            >
                                                <TableCell className="py-5 pl-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-black text-slate-900 dark:text-white">
                                                            {new Date(tx.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                                            {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <Link href={`/inventory/${tx.item_id}`} className="group/item flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm group-hover/item:bg-blue-600 group-hover/item:border-blue-500 transition-all">
                                                            <Package className="size-5 text-slate-600 dark:text-slate-400 group-hover/item:text-white transition-colors" />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-sm font-black text-slate-900 dark:text-white leading-none mb-1 group-hover/item:text-blue-600 transition-colors">{tx.item.name}</span>
                                                            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                                                                {tx.item.item_code}
                                                            </span>
                                                        </div>
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="py-5">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                        tx.type === 'addition'
                                                            ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                                                            : "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                                                    )}>
                                                        {tx.type === 'addition' ? (
                                                            <ArrowUpRight className="size-3 stroke-[3px]" />
                                                        ) : (
                                                            <ArrowDownLeft className="size-3 stroke-[3px]" />
                                                        )}
                                                        {tx.type === 'addition' ? 'Inbound' : 'Outbound'}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 text-center">
                                                    <div className="flex flex-col items-center">
                                                        <span className={cn(
                                                            "text-lg font-black tracking-tight",
                                                            tx.type === 'addition' ? "text-emerald-600" : "text-red-500"
                                                        )}>
                                                            {tx.type === 'addition' ? '+' : '-'}{tx.quantity}
                                                        </span>
                                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                                            {tx.item.unit.name}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-5 pr-8">
                                                    <div className="flex items-start gap-2 max-w-sm">
                                                        <FileText className="size-4 text-slate-300 dark:text-slate-600 mt-0.5 shrink-0" />
                                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 italic leading-relaxed">
                                                            {tx.notes || 'System automated ledger entry - no manual notes recorded.'}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Premium Pagination */}
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Page <span className="text-slate-900 dark:text-white">{transactions.current_page}</span> of {transactions.last_page}
                    </p>
                    <div className="flex items-center gap-1.5">
                        {transactions.links.map((link, i) => {
                            if (link.label.includes('Previous') || link.label.includes('Next')) return null;
                            return (
                                <button
                                    key={i}
                                    disabled={!link.url}
                                    className={cn(
                                        "size-10 rounded-xl text-xs font-black transition-all flex items-center justify-center border",
                                        link.active
                                            ? "bg-slate-900 border-slate-900 text-white dark:bg-white dark:border-white dark:text-slate-950 shadow-xl"
                                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-800 hover:text-slate-950 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-400 dark:hover:text-white",
                                        !link.url && "opacity-30 cursor-not-allowed"
                                    )}
                                    onClick={() => {
                                        if (link.url) router.visit(link.url);
                                    }}
                                >
                                    {link.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
