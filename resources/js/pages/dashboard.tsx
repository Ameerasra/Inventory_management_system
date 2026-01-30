import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Activity, Warehouse, TrendingUp, AlertTriangle, Boxes, History } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DashboardProps {
    stats: {
        totalItems: number;
        totalStock: number;
        lowStockCount: number;
        usedPercentage: number;
        totalCategories: number;
    };
    charts: {
        stockByCategory: Array<{ name: string; stock: number }>;
        transactionHistory: Array<{ day: string; additions: number; deductions: number }>;
        capacityData: Array<{ name: string; value: number; color: string }>;
    };
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
};

export default function Dashboard({ stats, charts }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }]}>
            <Head title="Enterprise Dashboard" />

            <div className="flex flex-1 flex-col gap-8 p-6 md:p-10 bg-slate-50/50 dark:bg-slate-950/50 min-h-screen">

                {/* Header Section */}
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">System Insight</h2>
                        <p className="text-slate-500 font-medium">Global inventory metrics and real-time logistics.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">Database Live</span>
                        </div>
                    </div>
                </div>

                {/* KPI Cards */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
                >
                    {[
                        {
                            title: 'Total Products',
                            value: stats?.totalItems ?? 0,
                            sub: `Across ${stats?.totalCategories ?? 0} Categories`,
                            icon: Boxes,
                            color: 'text-blue-600',
                            bg: 'bg-blue-50 dark:bg-blue-950/30'
                        },
                        {
                            title: 'Stock in Hand',
                            value: (stats?.totalStock ?? 0).toLocaleString(),
                            sub: 'Total logistics volume',
                            icon: Activity,
                            color: 'text-indigo-600',
                            bg: 'bg-indigo-50 dark:bg-indigo-950/30'
                        },
                        {
                            title: 'Low Stock Alerts',
                            value: stats?.lowStockCount ?? 0,
                            sub: stats?.lowStockCount > 0 ? 'Action Required' : 'Optimal Levels',
                            icon: AlertTriangle,
                            color: stats?.lowStockCount > 0 ? 'text-red-600' : 'text-emerald-600',
                            bg: stats?.lowStockCount > 0 ? 'bg-red-50 dark:bg-red-950/30' : 'bg-emerald-50 dark:bg-emerald-950/30'
                        },
                        {
                            title: 'Storage Used',
                            value: `${stats?.usedPercentage ?? 0}%`,
                            sub: 'Capacity saturation',
                            icon: Warehouse,
                            color: 'text-purple-600',
                            bg: 'bg-purple-50 dark:bg-purple-950/30'
                        }
                    ].map((kpi, idx) => (
                        <motion.div key={idx} variants={item}>
                            <Card className="relative overflow-hidden border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800 transition-all hover:shadow-xl hover:-translate-y-1">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-500">{kpi.title}</CardTitle>
                                    <div className={cn("p-2 rounded-xl", kpi.bg)}>
                                        <kpi.icon className={cn("h-4 w-4", kpi.color)} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-black text-slate-900 dark:text-white">{kpi.value}</div>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-wider mt-1.5", kpi.color)}>
                                        {kpi.sub}
                                    </p>
                                </CardContent>
                                <div className={cn("absolute bottom-0 left-0 h-1 w-full", kpi.color.replace('text', 'bg'))} />
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Areas */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
                >
                    {/* Stock Levels Chart */}
                    <motion.div variants={item} className="col-span-4">
                        <Card className="h-full border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Stock Distribution</CardTitle>
                                    <CardDescription>Visualizing inventory across all categories.</CardDescription>
                                </div>
                                <div className="p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                                    <TrendingUp className="size-4 text-blue-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-2">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={charts.stockByCategory}>
                                            <defs>
                                                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                                                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.8} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#888888"
                                                fontSize={11}
                                                fontWeight="bold"
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={11}
                                                fontWeight="bold"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <RechartsTooltip
                                                cursor={{ fill: 'rgba(59, 130, 246, 0.05)', radius: 4 }}
                                                contentStyle={{
                                                    borderRadius: '16px',
                                                    border: '1px solid rgba(0,0,0,0.05)',
                                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                    background: 'rgba(255,255,255,0.95)',
                                                    backdropFilter: 'blur(8px)',
                                                    padding: '12px'
                                                }}
                                            />
                                            <Bar dataKey="stock" fill="url(#barGradient)" radius={[6, 6, 0, 0]} name="Logistics Unit" barSize={35} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Warehouse Capacity Gauge */}
                    <motion.div variants={item} className="col-span-3">
                        <Card className="h-full border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
                            <CardHeader>
                                <CardTitle className="text-lg font-bold">Operational Capacity</CardTitle>
                                <CardDescription>Physical warehouse saturation report.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[350px] flex items-center justify-center relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={charts.capacityData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={80}
                                                outerRadius={105}
                                                paddingAngle={8}
                                                dataKey="value"
                                                stroke="none"
                                            >
                                                {charts.capacityData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                        className="transition-all hover:opacity-80"
                                                    />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-5xl font-black text-slate-900 dark:text-white">{stats?.usedPercentage ?? 0}%</span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">Utilization</span>
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div className="size-3 rounded-full bg-blue-600" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Used Space</span>
                                    </div>
                                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50">
                                        <div className="size-3 rounded-full bg-slate-200 dark:bg-slate-700" />
                                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Inventory Potential</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>

                {/* History Row */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="grid gap-6 md:grid-cols-1"
                >
                    <motion.div variants={item}>
                        <Card className="border-none shadow-md ring-1 ring-slate-200 dark:ring-slate-800">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="text-lg font-bold">Movement Velocity</CardTitle>
                                    <CardDescription>Tracking inflow and outflow dynamics over 7 days.</CardDescription>
                                </div>
                                <div className="p-2 rounded-full bg-indigo-50 dark:bg-indigo-900/40">
                                    <History className="size-4 text-indigo-500" />
                                </div>
                            </CardHeader>
                            <CardContent className="px-2">
                                <div className="h-[350px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={charts.transactionHistory}>
                                            <defs>
                                                <linearGradient id="addGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="dedGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                                            <XAxis
                                                dataKey="day"
                                                stroke="#888888"
                                                fontSize={11}
                                                fontWeight="bold"
                                                tickLine={false}
                                                axisLine={false}
                                                dy={10}
                                            />
                                            <YAxis
                                                stroke="#888888"
                                                fontSize={11}
                                                fontWeight="bold"
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <RechartsTooltip
                                                contentStyle={{
                                                    borderRadius: '16px',
                                                    border: 'none',
                                                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                                                    background: 'rgba(255,255,255,0.95)',
                                                    backdropFilter: 'blur(8px)'
                                                }}
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="additions"
                                                stroke="#10b981"
                                                strokeWidth={3}
                                                fill="url(#addGradient)"
                                                name="Inbound Stock"
                                            />
                                            <Area
                                                type="monotone"
                                                dataKey="deductions"
                                                stroke="#ef4444"
                                                strokeWidth={3}
                                                fill="url(#dedGradient)"
                                                name="Outbound Stock"
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
