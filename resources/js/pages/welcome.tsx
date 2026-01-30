import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import type { SharedData } from '@/types';
import { Box, ShieldCheck, Zap, Layers, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '@/assets/logo.png';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen bg-[#020617] text-slate-50 selection:bg-blue-500/30 selection:text-blue-200 font-sans">
            <Head title="Inventory Pro - Modern Stock Management" />

            {/* Premium Background Section */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse-slow" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[150px] rounded-full animate-pulse-slow delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-25 mix-blend-overlay" />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
                {/* Navbar */}
                <header className="flex items-center justify-between pt-8 h-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center gap-3 cursor-default"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-linear-to-r from-blue-600 to-indigo-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <img src={logo} className="relative flex h-10 w-10 items-center justify-center rounded-lg shadow-2xl transition hover:scale-105" alt="Logo" />
                        </div>
                        <span className="text-xl font-bold tracking-tighter bg-clip-text text-transparent bg-linear-to-r from-white via-slate-200 to-slate-400">
                            Inventory Pro
                        </span>
                    </motion.div>

                    <nav className="flex items-center gap-6">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="group relative rounded-full bg-white/5 px-6 py-2.5 text-sm font-semibold text-white ring-1 ring-white/10 transition-all hover:bg-white/10 hover:ring-white/20 active:scale-95"
                            >
                                <span className="flex items-center gap-2">
                                    Go to Dashboard
                                    <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-semibold text-slate-400 transition-colors hover:text-white"
                                >
                                    Log in
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="relative inline-flex items-center justify-center rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95"
                                    >
                                        Join Now
                                    </Link>
                                )}
                            </>
                        )}
                    </nav>
                </header>

                <main className="pt-12 lg:pt-24 pb-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        {/* Hero Content */}
                        <div className="flex flex-col gap-10">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                className="inline-flex self-start items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-xs font-bold leading-5 text-blue-400 backdrop-blur-sm"
                            >
                                <Zap className="size-3.5 fill-current" />
                                <span className="uppercase tracking-widest">Powered by Real-Time Analytics</span>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.1 }}
                            >
                                <h1 className="text-6xl lg:text-[5.5rem] font-black tracking-tight leading-[0.95] text-white">
                                    Master Your <br />
                                    <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-indigo-400 to-purple-500">
                                        Inventory Flow.
                                    </span>
                                </h1>
                                <p className="mt-8 max-w-xl text-xl text-slate-400 leading-relaxed font-medium">
                                    Experience the future of warehouse management. Build with precision, track with ease, and scale with confidence using our state-of-the-art platform.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex flex-wrap gap-5"
                            >
                                <Link
                                    href={register()}
                                    className="group relative rounded-2xl bg-white px-10 py-5 text-base font-bold text-slate-900 shadow-2xl transition-all hover:bg-slate-100 hover:scale-[1.03] active:scale-[0.98] overflow-hidden"
                                >
                                    <span className="relative z-10 flex items-center gap-2">
                                        Start Free Trial
                                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                                <button
                                    className="group rounded-2xl bg-slate-900/50 backdrop-blur-md border border-slate-800 px-10 py-5 text-base font-bold text-white transition-all hover:bg-slate-800/80 hover:border-slate-700 active:scale-[0.98]"
                                >
                                    <span className="flex items-center gap-2">
                                        <Play className="size-4 fill-current text-blue-500" />
                                        Watch Demo
                                    </span>
                                </button>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="grid grid-cols-2 sm:grid-cols-3 gap-8 border-t border-slate-800/60 pt-10"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-black text-white">50k+</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Items Tracked</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-2xl font-black text-white">99.9%</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Accuracy rate</span>
                                </div>
                                <div className="hidden sm:flex flex-col gap-1">
                                    <span className="text-2xl font-black text-white">24/7</span>
                                    <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Live Support</span>
                                </div>
                            </motion.div>
                        </div>

                        {/* Interactive Visual Element */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="relative perspective-1000 hidden lg:block"
                        >
                            <div className="absolute -inset-4 bg-linear-to-tr from-blue-500/20 to-indigo-600/20 blur-3xl opacity-50" />

                            <div className="relative h-[650px] w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800/60 rounded-[3rem] p-10 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
                                {/* Browser Chrome */}
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex gap-2.5">
                                        <div className="size-3.5 rounded-full bg-slate-800 border border-slate-700/50 shadow-inner" />
                                        <div className="size-3.5 rounded-full bg-slate-800 border border-slate-700/50 shadow-inner" />
                                        <div className="size-3.5 rounded-full bg-slate-800 border border-slate-700/50 shadow-inner" />
                                    </div>
                                    <div className="px-4 py-1.5 rounded-full bg-blue-500/10 text-[10px] uppercase font-black tracking-widest text-blue-400 border border-blue-500/20">
                                        Live Inventory Node
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    {[
                                        { label: 'Real-time Stock Monitor', icon: Layers, color: 'text-blue-400', progress: 85, trend: '+12%' },
                                        { label: 'Global Distribution', icon: Box, color: 'text-indigo-400', progress: 62, trend: '+5%' },
                                        { label: 'Automated Restocking', icon: Zap, color: 'text-purple-400', progress: 94, trend: 'Optimal' },
                                    ].map((stat, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ x: 50, opacity: 0 }}
                                            animate={{ x: 0, opacity: 1 }}
                                            transition={{ delay: 0.4 + (i * 0.15) }}
                                            className="space-y-4"
                                        >
                                            <div className="flex justify-between items-end">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 ${stat.color}`}>
                                                        <stat.icon className="size-5" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-slate-100">{stat.label}</h4>
                                                        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Operational</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-xs font-black text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded-full">{stat.trend}</span>
                                                </div>
                                            </div>
                                            <div className="relative h-2.5 w-full bg-slate-800/50 rounded-full overflow-hidden border border-slate-700/30">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${stat.progress}%` }}
                                                    transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                                                    className={`absolute inset-y-0 left-0 rounded-full bg-linear-to-r ${stat.color.replace('text', 'from').replace('-400', '-500')} to-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]`}
                                                />
                                            </div>
                                        </motion.div>
                                    ))}

                                    <motion.div
                                        initial={{ y: 50, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="mt-12 p-6 rounded-3xl bg-linear-to-br from-slate-800/50 to-transparent border border-slate-700/50 backdrop-blur-md relative overflow-hidden group"
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                            <ShieldCheck className="size-20 text-blue-400" />
                                        </div>
                                        <div className="relative z-10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="size-12 rounded-2xl bg-blue-600/20 flex items-center justify-center border border-blue-500/30 shadow-2xl shadow-blue-500/20">
                                                    <ShieldCheck className="text-blue-400 size-6" />
                                                </div>
                                                <div>
                                                    <h4 className="text-base font-bold text-white">Enterprise Security</h4>
                                                    <p className="text-xs text-slate-500 font-medium">AES-256 Cloud Persistence</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-blue-400">
                                                <CheckCircle2 className="size-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Active</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Floating Decorative Cards */}
                                <motion.div
                                    animate={{ y: [0, -15, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -bottom-6 -left-6 p-6 rounded-2xl bg-white text-slate-900 shadow-2xl border border-slate-100 flex items-center gap-4 animate-float"
                                >
                                    <div className="size-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">ID</div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black">Stock Alert!</span>
                                        <span className="text-[10px] text-slate-500">Iphone 15 Pro (Low)</span>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </main>

                <footer className="py-16 border-t border-slate-900 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition duration-500">
                        <img src={logo} className="h-6 w-6" alt="Footer Logo" />
                        <span className="text-sm font-bold tracking-tight text-white uppercase italic">Inventory Pro</span>
                    </div>
                    <p className="text-xs text-slate-600 font-bold uppercase tracking-[0.3em]">&copy; 2026 Modern Inventory Solutions. Built for the next generation.</p>
                </footer>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.4; scale: 1; }
                    50% { opacity: 0.6; scale: 1.1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            ` }} />
        </div>
    );
}
