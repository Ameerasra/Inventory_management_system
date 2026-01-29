import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Package } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="min-h-screen bg-[#0a0a0b] text-white flex overflow-hidden">
            {/* Left Column: Visual/Decoration (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-[#0a0a0b] via-[#111115] to-[#12122b] items-center justify-center border-r border-white/5">
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute top-[-10%] left-[10%] w-[50%] h-[50%] bg-blue-500/10 blur-[100px] rounded-full" />
                    <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full" />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-150 grayscale" />
                </div>

                <div className="relative flex flex-col items-center gap-6 p-12 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 shadow-2xl shadow-blue-500/40">
                        <Package className="size-10 text-white" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight">Precision in every box.</h2>
                        <p className="text-gray-400 font-medium text-lg max-w-sm mx-auto">
                            Manage your warehouse operations with the speed of thought.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Column: Form */}
            <div className="w-full lg:w-1/2 flex flex-col relative">
                <header className="absolute top-0 right-0 p-8">
                    <Link href={home()} className="text-sm font-semibold text-gray-500 hover:text-white transition-colors">
                        &larr; Back to Home
                    </Link>
                </header>

                <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
                    <div className="w-full max-w-sm space-y-8">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                {title}
                            </h1>
                            <p className="text-gray-400 text-sm font-medium">
                                {description}
                            </p>
                        </div>

                        <div className="p-1 rounded-3xl bg-white/[0.02] border border-white/5 shadow-2xl backdrop-blur-sm">
                            <div className="bg-[#121214] rounded-[1.4rem] p-6 sm:p-8">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-8 text-center text-[10px] text-gray-600 uppercase tracking-widest font-bold">
                    Secure &middot; Encrypted &middot; Professional
                </footer>
            </div>
        </div>
    );
}
