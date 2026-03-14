import React from 'react';

const DashboardPreview: React.FC = () => {
  return (
    <section className="py-24 md:py-32 relative border-t border-white/5 bg-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Command Center</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                Premium Investor Dashboard
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                Monitor your entire wealth ecosystem from a single, unified interface. Real-time analytics, automated execution tracking, and transparent fee management.
            </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative max-w-5xl mx-auto">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-prime-cyan/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
            
            <div className="bg-[#0a0a0a] border border-white/10 rounded-t-3xl rounded-b-xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                {/* Browser/App Header */}
                <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.02] border-b border-white/5">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
                    </div>
                    <div className="mx-auto px-4 py-1 rounded bg-black/50 border border-white/5 text-[9px] font-mono text-slate-500 flex items-center gap-2">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        app.teslaprime.ai
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
                    
                    {/* Sidebar Mockup */}
                    <div className="hidden md:flex flex-col gap-4 col-span-3 border-r border-white/5 pr-6">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-white text-black rounded-lg flex items-center justify-center font-black">T</div>
                            <div className="font-bold text-white tracking-widest uppercase text-xs">Prime AI</div>
                        </div>
                        {['Overview', 'Portfolio', 'AI Bots', 'Real Estate', 'Reseller', 'Settings'].map((item, i) => (
                            <div key={i} className={`px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest ${i === 0 ? 'bg-prime-cyan/10 text-prime-cyan border border-prime-cyan/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
                                {item}
                            </div>
                        ))}
                    </div>

                    {/* Main Content Mockup */}
                    <div className="col-span-1 md:col-span-9 space-y-6">
                        
                        {/* Top Stats */}
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Total Balance</div>
                                <div className="text-2xl font-mono text-white font-bold">$142,850.00</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">24h Profit</div>
                                <div className="text-2xl font-mono text-emerald-400 font-bold">+$1,240.50</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-2xl p-5">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Bots</div>
                                <div className="text-2xl font-mono text-white font-bold">3 <span className="text-sm text-slate-500">Deployed</span></div>
                            </div>
                        </div>

                        {/* Chart Area */}
                        <div className="bg-white/5 border border-white/5 rounded-2xl p-5 h-48 flex flex-col justify-between">
                            <div className="flex justify-between items-center">
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Portfolio Growth</div>
                                <div className="flex gap-2">
                                    {['1D', '1W', '1M', 'ALL'].map((t, i) => (
                                        <span key={i} className={`text-[9px] font-bold px-2 py-1 rounded ${i === 2 ? 'bg-white/10 text-white' : 'text-slate-500'}`}>{t}</span>
                                    ))}
                                </div>
                            </div>
                            {/* Fake Chart Lines */}
                            <div className="relative h-24 w-full mt-4">
                                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                                    <path d="M0,100 L0,50 Q25,40 50,60 T100,20 L100,100 Z" fill="rgba(0,240,255,0.1)" />
                                    <path d="M0,50 Q25,40 50,60 T100,20" fill="none" stroke="#00F0FF" strokeWidth="2" />
                                </svg>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Asset Allocation</div>
                                <div className="space-y-3">
                                    {[
                                        { name: 'Tesla Equity', val: '45%' },
                                        { name: 'AI Bots', val: '30%' },
                                        { name: 'Real Estate', val: '25%' }
                                    ].map((a, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-prime-cyan"></div>
                                            <div className="text-xs text-slate-300 flex-1">{a.name}</div>
                                            <div className="text-xs font-mono text-white">{a.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3">Recent Transactions</div>
                                <div className="space-y-2">
                                    {[
                                        { name: 'Bot Profit', val: '+$45.20', type: 'in' },
                                        { name: 'Fee Deduction', val: '-$2.50', type: 'out' },
                                        { name: 'Yield Payout', val: '+$120.00', type: 'in' }
                                    ].map((t, i) => (
                                        <div key={i} className="flex justify-between items-center p-2 rounded bg-white/[0.02]">
                                            <div className="text-xs text-slate-300">{t.name}</div>
                                            <div className={`text-xs font-mono ${t.type === 'in' ? 'text-emerald-400' : 'text-slate-500'}`}>{t.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
};

export default DashboardPreview;
