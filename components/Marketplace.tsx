import React, { useState } from 'react';

interface Bot {
    id: string;
    name: string;
    description: string;
    apy: number;
    winRate: number;
    risk: 'LOW' | 'MED' | 'HIGH' | 'EXTREME';
    price: number;
    author: string;
    tags: string[];
    isAuthorized: boolean;
}

const BOTS: Bot[] = [
    {
        id: 'bot-001',
        name: 'Neural Scalper V4',
        description: 'High-frequency scalping bot utilizing deep reinforcement learning to predict micro-trends in crypto markets.',
        apy: 142.5,
        winRate: 68.2,
        risk: 'HIGH',
        price: 49.99,
        author: 'QuantCore',
        tags: ['CRYPTO', 'HFT', 'SCALPING'],
        isAuthorized: true,
    },
    {
        id: 'bot-002',
        name: 'Macro Sentiment Engine',
        description: 'Analyzes global news sentiment and macroeconomic indicators to execute swing trades on major indices.',
        apy: 34.2,
        winRate: 74.5,
        risk: 'LOW',
        price: 19.99,
        author: 'AITradingLabs',
        tags: ['INDICES', 'SWING', 'SENTIMENT'],
        isAuthorized: false,
    },
    {
        id: 'bot-003',
        name: 'DeFi Arbitrage Node',
        description: 'Scans decentralized exchanges for price discrepancies and executes flash-loan powered arbitrage.',
        apy: 85.0,
        winRate: 92.1,
        risk: 'MED',
        price: 99.99,
        author: '0xAlpha',
        tags: ['DEFI', 'ARBITRAGE', 'FLASH-LOAN'],
        isAuthorized: false,
    },
    {
        id: 'bot-004',
        name: 'Volatility Breakout AI',
        description: 'Identifies periods of low volatility and positions for explosive breakouts using options strategies.',
        apy: 215.8,
        winRate: 45.3,
        risk: 'EXTREME',
        price: 149.99,
        author: 'RiskTakersInc',
        tags: ['OPTIONS', 'VOLATILITY', 'BREAKOUT'],
        isAuthorized: false,
    }
];

export const Marketplace: React.FC = () => {
    const [bots, setBots] = useState<Bot[]>(() => {
        try {
            const saved = localStorage.getItem('prime_ai_marketplace_bots');
            return saved ? JSON.parse(saved) : BOTS;
        } catch (e) {
            return BOTS;
        }
    });
    const [authorizingId, setAuthorizingId] = useState<string | null>(null);

    React.useEffect(() => {
        localStorage.setItem('prime_ai_marketplace_bots', JSON.stringify(bots));
    }, [bots]);

    const handleAuthorize = (id: string) => {
        setAuthorizingId(id);
        setTimeout(() => {
            setBots(prev => prev.map(b => b.id === id ? { ...b, isAuthorized: true } : b));
            setAuthorizingId(null);
        }, 2000);
    };

    return (
        <div className="space-y-10 animate-[fadeIn_0.3s]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-2 h-2 bg-prime-cyan rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-black text-prime-cyan uppercase tracking-[0.3em]">Marketplace Status: Synchronized</span>
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-display">Algorithmic Marketplace</h2>
                    <p className="text-slate-400 text-lg font-medium max-w-2xl leading-relaxed">Discover, authorize, and deploy advanced AI trading models calibrated for <span className="text-white">institutional-grade execution</span>.</p>
                </div>
                <div className="bg-prime-cyan/10 px-6 py-3 rounded-2xl border border-prime-cyan/20 flex items-center gap-4 shadow-[0_0_20px_rgba(0,240,255,0.1)]">
                    <div className="relative">
                        <div className="w-3 h-3 bg-prime-cyan rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-prime-cyan rounded-full animate-ping opacity-50"></div>
                    </div>
                    <span className="text-[11px] font-black text-prime-cyan uppercase tracking-[0.2em]">Neural Link Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {bots.map(bot => (
                    <div key={bot.id} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden group hover:border-prime-cyan/40 transition-all duration-700 flex flex-col hover:-translate-y-2">
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-prime-cyan/5 blur-[80px] group-hover:bg-prime-cyan/10 transition-colors duration-700 pointer-events-none"></div>
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div>
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight font-display group-hover:text-prime-cyan transition-colors duration-500">{bot.name}</h3>
                                <div className="text-[10px] text-slate-500 font-mono uppercase tracking-[0.2em] mt-1.5 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                    By {bot.author}
                                </div>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                                bot.risk === 'LOW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                bot.risk === 'MED' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                bot.risk === 'HIGH' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                'bg-purple-500/10 text-purple-400 border-purple-500/20'
                            }`}>
                                {bot.risk} RISK
                            </div>
                        </div>

                        <p className="text-sm text-slate-400 mb-8 leading-relaxed flex-1 relative z-10 font-medium">{bot.description}</p>

                        <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Est. APY</div>
                                <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tighter">+{bot.apy.toFixed(1)}%</div>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 group-hover:border-white/10 transition-colors">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-2">Win Rate</div>
                                <div className="text-2xl font-mono font-bold text-white tracking-tighter">{bot.winRate.toFixed(1)}%</div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                            {bot.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-mono text-slate-400 uppercase tracking-wider border border-white/5 group-hover:border-white/10 transition-colors">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                            <div className="flex flex-col">
                                <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mb-0.5">Subscription</div>
                                <div className="text-2xl font-mono font-bold text-white tracking-tighter">${bot.price}<span className="text-[10px] text-slate-500 uppercase tracking-widest ml-1 font-medium">/mo</span></div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    className="w-12 h-12 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all flex items-center justify-center group/btn"
                                    onClick={() => window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank')}
                                    title="View Tutorial"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="group-hover/btn:scale-110 transition-transform"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                </button>
                                {bot.isAuthorized ? (
                                    <button disabled className="px-8 py-3 bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl border border-emerald-500/30 flex items-center gap-2">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        Authorized
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleAuthorize(bot.id)}
                                        disabled={authorizingId === bot.id}
                                        className="px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-prime-cyan transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 relative overflow-hidden group/auth"
                                    >
                                        {authorizingId === bot.id ? (
                                            <>
                                                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                                                Authorizing...
                                            </>
                                        ) : (
                                            <>
                                                Authorize Bot
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/auth:animate-[shimmer_2s_infinite]"></div>
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marketplace;
