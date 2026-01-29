import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { Package, Box, TrendingUp, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white selection:bg-blue-500/30 selection:text-blue-200">
            <Head title="Modern Inventory Solutions" />

            {/* Background Decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                <header className="flex items-center justify-between py-8">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                            <Package className="text-white size-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Inventory MS
                        </span>
                    </div>

                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="rounded-full bg-white/5 px-5 py-2 text-sm font-medium text-white ring-1 ring-inset ring-white/10 transition-all hover:bg-white/10"
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-500 hover:scale-105 active:scale-95"
                                    >
                                        Get Started
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="py-20 lg:py-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div className="flex flex-col gap-8">
                            <div className="inline-flex self-start items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold leading-5 text-blue-400 ring-1 ring-inset ring-blue-500/20">
                                <Zap className="size-3 fill-current" />
                                <span>v2.0 is now live</span>
                            </div>

                            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                                Optimized <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                    Inventory Flow.
                                </span>
                            </h1>

                            <p className="max-w-xl text-lg text-gray-400 leading-relaxed font-medium">
                                Professional-grade warehouse management for modern businesses. Track stock, manage transactions, and scale your operations with precise real-time data.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href={register()}
                                    className="rounded-xl bg-white px-8 py-4 text-sm font-bold text-black shadow-xl transition-all hover:bg-gray-100 hover:scale-105 active:scale-95"
                                >
                                    Start Free Trial
                                </Link>
                                <a
                                    href="https://github.com/laravel/react-starter-kit"
                                    target="_blank"
                                    className="group rounded-xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10"
                                >
                                    Explore Features
                                </a>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-8 border-t border-white/5 pt-8">
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-bold text-white">99.9%</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Uptime Guarantee</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-bold text-white">Real-time</span>
                                    <span className="text-xs text-gray-400 uppercase tracking-widest font-semibold">Sync Speed</span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Visual Element */}
                        <div className="relative lg:h-[600px] group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 rounded-[2rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
                            <div className="relative h-full w-full bg-[#161618] border border-white/10 rounded-[2.5rem] p-8 overflow-hidden shadow-2xl">
                                <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-6">
                                    <div className="flex gap-1.5">
                                        <div className="size-3 rounded-full bg-red-500/20 border border-red-500/40" />
                                        <div className="size-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                                        <div className="size-3 rounded-full bg-green-500/20 border border-green-500/40" />
                                    </div>
                                    <div className="px-3 py-1 rounded bg-white/5 text-[10px] uppercase font-bold tracking-widest text-gray-500">Live Dashboard</div>
                                </div>

                                <div className="space-y-6">
                                    {[
                                        { label: 'Stock Levels', icon: Layers, color: 'text-blue-400', pct: 'w-[85%]' },
                                        { label: 'Asset Value', icon: trendingUp, color: 'text-emerald-400', pct: 'w-[62%]' },
                                        { label: 'Warehouse Capacity', icon: Box, color: 'text-indigo-400', pct: 'w-[45%]' },
                                    ].map((stat, i) => (
                                        <div key={i} className="space-y-3">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="flex items-center gap-2">
                                                    <stat.icon className={`size-4 ${stat.color}`} />
                                                    <span className="font-semibold">{stat.label}</span>
                                                </div>
                                                <span className="text-gray-500">Active</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className={`h-full ${stat.color.replace('text', 'bg')} ${stat.pct} rounded-full transition-all duration-1000 delay-500`} />
                                            </div>
                                        </div>
                                    ))}

                                    <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/20 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="text-blue-400" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold">Secure Audit Log</span>
                                                <span className="text-[10px] text-gray-500 uppercase font-bold">Encrypted End-to-End</span>
                                            </div>
                                        </div>
                                        <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                                            <Zap className="size-4 text-blue-400 fill-current" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <footer className="py-12 border-t border-white/5 text-center text-sm text-gray-500">
                    <p>&copy; 2026 Inventory MS. Built for performance.</p>
                </footer>
            </div>
        </div>
    );
}

const trendingUp = TrendingUp; // Fix for lowercase variable in map
