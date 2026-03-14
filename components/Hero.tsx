import React, { useState, useEffect } from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  const [chartData, setChartData] = useState<{i: number, val: number}[]>([]);

  useEffect(() => {
    // Initialize standard equity curve data
    const initialData = Array.from({ length: 40 }, (_, i) => ({
        i,
        val: 50 + Math.random() * 20 + (i * 0.5) // Slight upward trend
    }));
    setChartData(initialData);

    const interval = setInterval(() => {
        setChartData(prev => {
            const last = prev[prev.length - 1];
            const newVal = Math.max(20, Math.min(100, last.val + (Math.random() * 6 - 2.5))); // Random walk with bias
            return [...prev.slice(1), { i: last.i + 1, val: newVal }];
        });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header id="home" className="relative pt-32 sm:pt-48 pb-24 sm:pb-40 px-4 sm:px-6 min-h-screen flex items-center border-b border-white/10 bg-transparent">
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] md:bg-[size:60px_60px] opacity-20 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div className="text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">TESLA EXCLUSIVE INVESTMENT ECOSYSTEM</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black font-display text-white mb-6 md:mb-8 tracking-tighter leading-[1.1]">
              Build Smarter Wealth with <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-cyan via-blue-400 to-indigo-500">Tesla Prime AI</span>
            </h1>
            
            <p className="text-base md:text-lg text-slate-300 mb-8 md:mb-12 max-w-lg leading-relaxed font-medium">
              A premium intelligent platform for long-term Tesla shares, AI bot trading, short-term investment cycles, real estate participation, and global reseller income.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
              <button 
                onClick={onStart}
                className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-white text-black hover:bg-prime-cyan font-black text-[10px] md:text-xs rounded-full shadow-[0_0_40px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 uppercase tracking-[0.2em] font-display"
              >
                Get Started
              </button>
              <button 
                onClick={() => {
                    const el = document.getElementById('features');
                    if (el) {
                        const yOffset = -80;
                        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
                        window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                }}
                className="w-full sm:w-auto px-10 md:px-12 py-4 md:py-5 bg-black/40 backdrop-blur-md border border-white/20 hover:border-white text-white font-bold text-[10px] md:text-xs rounded-full transition-all uppercase tracking-[0.2em] hover:bg-white/10 font-display"
              >
                Explore Platform
              </button>
            </div>

            <div className="mt-12 md:mt-16 flex flex-wrap items-center gap-6 md:gap-8 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">
                <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    <span>AI-Powered Strategies</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                    <span>Transparent Fees</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    <span>Diversified Access</span>
                </div>
                <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    <span>Premium Dashboard</span>
                </div>
            </div>
        </div>

        <div className="relative hidden lg:block perspective-1000">
            <div className="relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-1000 ease-out animate-float">
                <div className="bg-black/60 rounded-[2rem] border border-white/5 overflow-hidden h-[500px] xl:h-[600px] flex flex-col relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent pointer-events-none z-20"></div>
                    
                    <div className="p-4 xl:p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex gap-2">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                        </div>
                        <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-display">TESLA-PRIME-V4.2.EXE</div>
                    </div>
                    
                    <div className="p-6 xl:p-8 flex-1 relative flex flex-col">
                        <div className="flex justify-between items-end mb-8 xl:mb-12">
                            <div>
                                <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2 font-display">Net Liquidity</div>
                                <div className="text-3xl xl:text-5xl font-mono text-white font-bold tracking-tighter">$2,845,120</div>
                            </div>
                            <div className="text-emerald-400 font-black text-[10px] bg-emerald-500/10 px-2 py-1 xl:px-3 xl:py-1.5 rounded-lg border border-emerald-500/20 tracking-widest font-display">+18.4%</div>
                        </div>

                        <div className="flex-1 w-full relative mb-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="heroChartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#00F0FF" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <YAxis domain={['dataMin - 10', 'dataMax + 10']} hide />
                                    <Area 
                                        type="monotone" 
                                        dataKey="val" 
                                        stroke="#00F0FF" 
                                        strokeWidth={2} 
                                        fill="url(#heroChartGradient)" 
                                        isAnimationActive={false}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="grid grid-cols-2 gap-3 xl:gap-4">
                            <div className="bg-white/5 backdrop-blur-md p-4 xl:p-5 rounded-xl xl:rounded-2xl border border-white/10">
                                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 font-display">AI Bot Performance</div>
                                <div className="text-lg xl:text-xl font-bold text-prime-cyan">+42.8%</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 xl:p-5 rounded-xl xl:rounded-2xl border border-white/10">
                                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 font-display">Wallet Balance</div>
                                <div className="text-lg xl:text-xl font-bold text-white">$12,450</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 xl:p-5 rounded-xl xl:rounded-2xl border border-white/10">
                                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 font-display">Fee Summary</div>
                                <div className="text-lg xl:text-xl font-bold text-white">0.15%</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md p-4 xl:p-5 rounded-xl xl:rounded-2xl border border-white/10">
                                <div className="text-[8px] text-slate-500 uppercase font-black tracking-widest mb-1 font-display">Recent Transactions</div>
                                <div className="text-lg xl:text-xl font-bold text-white">12</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Glow Effect */}
            <div className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
      </div>
    </header>
  );
};