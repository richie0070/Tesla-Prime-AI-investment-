import React from 'react';

interface BotShowcaseProps {
    onDeploy: () => void;
}

const BotShowcase: React.FC<BotShowcaseProps> = ({ onDeploy }) => {
  return (
    <section id="ai-trading" className="py-24 md:py-32 px-6 relative border-t border-white/5 bg-transparent overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column - Bot UI Mockup */}
            <div className="relative order-2 lg:order-1">
                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative z-10">
                    
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-prime-cyan/10 border border-prime-cyan/20 flex items-center justify-center text-prime-cyan">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                            </div>
                            <div>
                                <div className="text-white font-bold font-display">Titan Momentum X</div>
                                <div className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">24h Profit</div>
                            <div className="text-xl font-mono text-emerald-400 font-bold">+$1,240.50</div>
                        </div>
                    </div>

                    {/* Grid Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Win Rate</div>
                            <div className="flex items-end gap-2">
                                <div className="text-3xl font-mono text-white font-bold">78.4%</div>
                                <div className="text-xs text-emerald-400 font-mono mb-1">+2.1%</div>
                            </div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Pairs</div>
                            <div className="flex gap-2 mt-2">
                                <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white">TSLA/USD</span>
                                <span className="px-2 py-1 bg-white/10 rounded text-xs font-mono text-white">BTC/USD</span>
                            </div>
                        </div>
                    </div>

                    {/* Live Trade Feed */}
                    <div>
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Live Execution Feed</div>
                        <div className="space-y-3">
                            {[
                                { pair: 'TSLA/USD', type: 'BUY', price: '175.40', time: '2s ago', profit: null },
                                { pair: 'BTC/USD', type: 'SELL', price: '68,450', time: '14s ago', profit: '+$45.20' },
                                { pair: 'TSLA/USD', type: 'SELL', price: '176.10', time: '45s ago', profit: '+$12.50' }
                            ].map((trade, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded ${trade.type === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                            {trade.type}
                                        </div>
                                        <div className="font-mono text-sm text-white">{trade.pair}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono text-sm text-slate-300">{trade.price}</div>
                                        {trade.profit ? (
                                            <div className="text-[10px] font-mono text-emerald-400">{trade.profit}</div>
                                        ) : (
                                            <div className="text-[10px] text-slate-500">{trade.time}</div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
                
                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
            </div>

            {/* Right Column - Content */}
            <div className="order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Algorithmic Trading</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                    AI Bot Trading <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-cyan to-blue-500">Automation</span>
                </h2>
                
                <p className="text-slate-400 text-lg leading-relaxed mb-8">
                    Deploy institutional-grade trading algorithms that operate 24/7. Our neural networks analyze millions of data points to execute high-probability trades with zero emotional interference.
                </p>

                <ul className="space-y-4 mb-10">
                    {[
                        'High-frequency execution capabilities',
                        'Dynamic risk management protocols',
                        'Pre-configured strategy templates',
                        'Real-time performance analytics'
                    ].map((benefit, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                            <span className="w-5 h-5 rounded-full bg-prime-cyan/10 flex items-center justify-center text-prime-cyan border border-prime-cyan/20">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                            </span>
                            {benefit}
                        </li>
                    ))}
                </ul>

                <button 
                    onClick={onDeploy}
                    className="px-8 py-4 bg-white text-black hover:bg-prime-cyan font-black text-xs rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 uppercase tracking-[0.2em]"
                >
                    Explore Trading Bots
                </button>
            </div>

        </div>
    </section>
  );
};

export default BotShowcase;