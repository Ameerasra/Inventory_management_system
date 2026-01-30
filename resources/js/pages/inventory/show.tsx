import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { ArrowLeft, Package, History, Activity, Calendar, FileText, ChevronRight, TrendingUp, TrendingDown, Clock, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    category?: {
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
        total: number;
    };
}

export default function ItemShow({ item, transactions }: Props) {
    return (
        <AppLayout breadcrumbs={[
            { title: 'Inventory', href: '/inventory' },
            { title: item.name, href: `/inventory/${item.id}` }
        ]}>
            <Head title={`${item.name} | Inventory Control`} />

            <div className="flex h-full flex-col gap-10 p-6 lg:p-12 max-w-7xl mx-auto w-full bg-[#f8fafc] dark:bg-[#0a0a0b]">
                {/* Elite Navbar */}
                <nav className="flex items-center justify-between">
                    <Link
                        href="/inventory"
                        className="group flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-xl hover:-translate-y-0.5"
                    >
                        <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Back to Fleet</span>
                    </Link>

                    <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="size-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Last audit: {new Date().toLocaleDateString()}</span>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center gap-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-600 text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                                    <ShieldCheck className="size-3" />
                                    Verified Asset
                                </span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">SKU: {item.item_code}</span>
                            </div>
                            <h1 className="text-5xl lg:text-6xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
                                {item.name}
                            </h1>
                            <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-2xl">
                                {item.description || 'Global inventory node with high-precision tracking and automated logistics reconciliation.'}
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Category', value: item.category?.name || 'Unclassified', icon: Package },
                                { label: 'Measurement', value: item.unit.name, icon: Activity },
                                { label: 'Audit Count', value: transactions.total, icon: History },
                            ].map((stat, i) => (
                                <Card key={i} className="border-none shadow-sm ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900/50 rounded-2xl">
                                    <div className="p-5 space-y-2">
                                        <div className="flex items-center gap-2 text-slate-400">
                                            <stat.icon className="size-3" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.15em]">{stat.label}</span>
                                        </div>
                                        <p className="text-lg font-black text-slate-900 dark:text-white truncate">{stat.value}</p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="lg:col-span-1"
                    >
                        <Card className={cn(
                            "relative overflow-hidden border-none shadow-2xl rounded-[2.5rem] transition-all duration-700 h-full",
                            item.is_low_stock ? "bg-red-600 text-white" : "bg-slate-900 text-white dark:bg-white dark:text-slate-950"
                        )}>
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <TrendingUp className="size-32" />
                            </div>
                            <div className="relative z-10 p-10 flex flex-col h-full justify-between gap-12">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 mb-2">Live Availability</p>
                                    <div className="flex items-baseline gap-3">
                                        <h2 className="text-7xl font-black tracking-tighter tabular-nums">{item.stock_quantity}</h2>
                                        <span className="text-xl font-black opacity-60 uppercase">{item.unit.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest opacity-80 border-b border-white/10 dark:border-slate-900/10 pb-4">
                                        <span>Inventory Status</span>
                                        <span className="flex items-center gap-2">
                                            <div className={cn("size-2 rounded-full animate-pulse", item.is_low_stock ? "bg-white" : "bg-emerald-400")} />
                                            {item.is_low_stock ? 'CRITICAL ALERT' : 'OPTIMAL LEVEL'}
                                        </span>
                                    </div>
                                    <p className="text-xs font-medium opacity-70 leading-relaxed italic">
                                        {item.is_low_stock
                                            ? 'The current stock level is below the defined safety threshold. Immediate replenishment required.'
                                            : 'Stock levels are within healthy parameters. No immediate action required.'}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

                {/* Ledger Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <History className="size-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black tracking-tight text-slate-900 dark:text-white">Audit Ledger</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Transaction History & Chain of Custody</p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inbound Delta</p>
                                <p className="text-sm font-black text-emerald-600">+12% vs last month</p>
                            </div>
                        </div>
                    </div>

                    <Card className="border-none shadow-2xl ring-1 ring-slate-200 dark:ring-slate-800 bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50/50 dark:bg-slate-950/40 border-b dark:border-slate-800">
                                <TableRow className="hover:bg-transparent border-slate-100 dark:border-slate-800/60">
                                    <TableHead className="w-[180px] py-6 pl-10 font-black uppercase tracking-widest text-[9px] text-slate-500">Date & Time</TableHead>
                                    <TableHead className="py-6 font-black uppercase tracking-widest text-[9px] text-slate-500">Operation Type</TableHead>
                                    <TableHead className="py-6 font-black uppercase tracking-widest text-[9px] text-slate-500 text-center">Magnitude</TableHead>
                                    <TableHead className="py-6 pr-10 font-black uppercase tracking-widest text-[9px] text-slate-500">Verification Ledger</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence mode="popLayout">
                                    {transactions.data.map((tx, idx) => (
                                        <motion.tr
                                            key={tx.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/40 border-slate-100 dark:border-slate-800/60 transition-all"
                                        >
                                            <TableCell className="py-6 pl-10">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-slate-900 dark:text-white uppercase tabular-nums">
                                                        {new Date(tx.created_at).toLocaleDateString([], { day: '2-digit', month: 'short' })}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                                        {new Date(tx.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
                                                    tx.type === 'addition'
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-800/50"
                                                        : "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800/50"
                                                )}>
                                                    <div className={cn("size-1.5 rounded-full", tx.type === 'addition' ? "bg-emerald-500" : "bg-red-500")} />
                                                    {tx.type === 'addition' ? 'Inbound Receipt' : 'Outbound Release'}
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 text-center tabular-nums">
                                                <div className="flex flex-col items-center">
                                                    <span className={cn(
                                                        "text-xl font-black",
                                                        tx.type === 'addition' ? "text-emerald-600" : "text-red-500"
                                                    )}>
                                                        {tx.type === 'addition' ? '+' : '-'}{tx.quantity}
                                                    </span>
                                                    <span className="text-[8px] font-black text-slate-400 uppercase">{item.unit.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="py-6 pr-10">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400">
                                                        <FileText className="size-3.5" />
                                                    </div>
                                                    <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 max-w-sm italic">
                                                        {tx.notes || 'Automated reconciliation recorded by inventory controller.'}
                                                    </p>
                                                </div>
                                            </TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Elite Pagination */}
                    {transactions.links.length > 3 && (
                        <div className="flex items-center justify-between px-6 py-4">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Secure Audit Stream</span>
                            <div className="flex gap-1.5">
                                {transactions.links.map((link, i) => {
                                    if (link.label.includes('Previous') || link.label.includes('Next')) return null;
                                    return (
                                        <Link
                                            key={i}
                                            href={link.url || '#'}
                                            className={cn(
                                                "size-9 rounded-xl flex items-center justify-center text-[10px] font-black border transition-all",
                                                link.active
                                                    ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-110 dark:bg-white dark:text-slate-950 dark:border-white"
                                                    : "bg-white text-slate-500 border-slate-200 hover:text-blue-600 hover:border-blue-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400"
                                            )}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
