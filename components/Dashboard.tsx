import React, { useEffect, useState, useMemo } from 'react';
import { TradingStats, TradingSettings, User, Transaction } from '../types';
import { AreaChart, Area, ResponsiveContainer, YAxis, XAxis, Tooltip, CartesianGrid } from 'recharts';
import NewsFeed from './NewsFeed';
import LiveBroker from './LiveBroker';
import { SettingsPanel } from './SettingsPanel';

import { LocalMLWidget } from './LocalMLWidget';
import Marketplace from './Marketplace';
import Liquidity from './Liquidity';
import Intel from './Intel';
import Portfolio from './Portfolio';
import MarketView from './MarketView';
import { TickerTape, MarketOverview } from 'react-ts-tradingview-widgets';

interface DashboardProps {
  stats: TradingStats;
  userProfile?: User;
  settings: TradingSettings;
  onUpdateSettings: (settings: TradingSettings) => void;
  onOpenDepositModal?: () => void;
  onOpenWithdrawModal?: () => void;
  activePage: string;
  onNavigate: (page: string) => void;
  transactions?: Transaction[];
}

const MARKETS_DATA_BASE = [
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.80, change: -1.20, vol: 'HIGH', cap: '556.2B', high: 180.20, low: 172.50 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 892.45, change: 2.45, vol: 'EXTREME', cap: '2.21T', high: 900.00, low: 885.00 },
  { symbol: 'BTC', name: 'Bitcoin', price: 68450.00, change: 1.50, vol: 'HIGH', cap: '1.34T', high: 69200.00, low: 67800.00 },
  { symbol: 'ETH', name: 'Ethereum', price: 3890.00, change: 0.95, vol: 'MED', cap: '460.5B', high: 3950.00, low: 3840.00 },
  { symbol: 'SOL', name: 'Solana', price: 145.20, change: 5.40, vol: 'HIGH', cap: '64.3B', high: 148.00, low: 138.00 },
];

const INITIAL_INDICES = [
    { name: 'S&P 500', value: 5234.12, change: 12.40, percent: 0.24 },
    { name: 'NASDAQ', value: 16420.88, change: 85.20, percent: 0.52 },
    { name: 'DOW JONES', value: 39512.50, change: -45.10, percent: -0.11 },
    { name: 'RUSSELL 2K', value: 2085.30, change: 15.40, percent: 0.74 }
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  stats, userProfile, settings, onUpdateSettings, 
  onOpenDepositModal, onOpenWithdrawModal, activePage, onNavigate, transactions 
}) => {
  const [liveMarkets, setLiveMarkets] = useState(() => 
    MARKETS_DATA_BASE.map(m => ({ ...m, history: Array.from({ length: 20 }, () => m.price * (1 + (Math.random() * 0.05 - 0.025))) }))
  );
  
  const [indices, setIndices] = useState(INITIAL_INDICES);
  const [isLiveBrokerOpen, setIsLiveBrokerOpen] = useState(false);
  const [chartRange, setChartRange] = useState<'1H' | '1D' | 'ALL'>('ALL');

  useEffect(() => {
    const interval = setInterval(() => {
        setLiveMarkets(prev => prev.map(m => {
            const fluctuation = (Math.random() * 0.004) - 0.002;
            const newPrice = m.price * (1 + fluctuation);
            return { ...m, price: newPrice, change: m.change + (fluctuation * 100), history: [...m.history.slice(1), newPrice] };
        }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
        setIndices(prev => prev.map(idx => {
            const move = (Math.random() * 2 - 1) * (idx.value * 0.0002);
            const newValue = idx.value + move;
            const newChange = idx.change + move;
            return {
                ...idx,
                value: newValue,
                change: newChange,
                percent: (newChange / (newValue - newChange)) * 100
            };
        }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const chartData = useMemo(() => {
      let current = stats.balance;
      const data = [{ time: 'NOW', value: current, timeFull: 'Live Telemetry' }];
      const slice = [...stats.history].slice(0, 50);
      slice.forEach((trade) => {
          current -= trade.amount;
          data.unshift({
            time: new Date(trade.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: current,
            timeFull: new Date(trade.timestamp).toLocaleString()
          });
      });
      return data;
  }, [stats.history, stats.balance]);

  const performanceMetrics = useMemo(() => {
      const history = stats.history;
      const totalTrades = history.length;
      const winningTrades = history.filter(t => t.type === 'profit');
      const losingTrades = history.filter(t => t.type === 'loss');
      
      const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
      const bestTrade = winningTrades.length > 0 ? Math.max(...winningTrades.map(t => Math.abs(t.amount))) : 0;
      const worstTrade = losingTrades.length > 0 ? Math.max(...losingTrades.map(t => Math.abs(t.amount))) : 0;
      
      return {
          winRate,
          bestTrade,
          worstTrade,
          totalTrades
      };
  }, [stats.history]);

  return (
    <div className="max-w-[1920px] mx-auto p-4 md:p-8 space-y-6 animate-[fadeIn_0.3s] relative z-10">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mb-6">
            <TickerTape key="dashboard-ticker-tape" colorTheme="dark" displayMode="adaptive" />
        </div>
        <LiveBroker isOpen={isLiveBrokerOpen} onClose={() => setIsLiveBrokerOpen(false)} stats={stats} liveMarkets={liveMarkets} />
        
        {/* Metric Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Primary Financials */}
            <div className="lg:col-span-4 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-16 bg-prime-cyan/5 blur-[50px] rounded-full"></div>
                <div>
                    <h3 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-display flex items-center gap-2">
                        Net Liquidity
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </h3>
                    <div className="text-4xl font-mono font-bold text-white tracking-tighter">${stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                </div>
                <div className="flex gap-2 mt-6">
                    <button onClick={onOpenDepositModal} className="flex-1 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase rounded-xl border border-emerald-500/10 transition-all">Deposit</button>
                    <button onClick={onOpenWithdrawModal} className="flex-1 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase rounded-xl border border-rose-500/10 transition-all">Withdraw</button>
                </div>
            </div>

            <div className="lg:col-span-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-12 bg-prime-cyan/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-prime-cyan/10 transition-colors"></div>
                <div>
                    <h3 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-display flex items-center gap-2">
                        Neural P/L
                        <span className="w-1 h-1 bg-prime-cyan rounded-full animate-pulse"></span>
                    </h3>
                    <div className={`text-4xl font-mono font-bold tracking-tighter ${stats.profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {stats.profit >= 0 ? '+' : ''}${Math.abs(stats.profit).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                </div>
                <div className="flex items-center gap-3 mt-6">
                    <div className="relative">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-50"></div>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Trades: <span className="text-white font-mono">{stats.trades}</span></div>
                </div>
            </div>

            {/* Trading Performance Indicators */}
            <div className="lg:col-span-5 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">
                <h3 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-display">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4 h-[calc(100%-2rem)]">
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Win Rate</div>
                        <div className="text-2xl font-mono font-bold text-white">{performanceMetrics.winRate.toFixed(1)}%</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Trades</div>
                        <div className="text-2xl font-mono font-bold text-white">{performanceMetrics.totalTrades}</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Best Trade</div>
                        <div className="text-xl font-mono font-bold text-emerald-400">+${performanceMetrics.bestTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 flex flex-col justify-center">
                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Worst Trade</div>
                        <div className="text-xl font-mono font-bold text-rose-400">-${performanceMetrics.worstTrade.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Main Interface */}
        {activePage === 'Dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl cursor-pointer hover:border-prime-cyan/30 transition-all group" onClick={() => onNavigate('Analysis')}>
                            <h3 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-display">Intelligence</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-prime-cyan/10 rounded-2xl flex items-center justify-center text-prime-cyan border border-prime-cyan/20">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Neural Hub</div>
                                    <div className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                                        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        Encrypted
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-prime-cyan/10 backdrop-blur-xl border border-prime-cyan/20 rounded-3xl p-6 shadow-xl cursor-pointer hover:bg-prime-cyan/20 transition-all group" onClick={() => setIsLiveBrokerOpen(true)}>
                            <h3 className="text-white text-[9px] font-black uppercase tracking-[0.2em] mb-4 font-display">Voice Uplink</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-prime-cyan border border-prime-cyan/40 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/></svg>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-white">Live Broker</div>
                                    <div className="text-[9px] text-prime-cyan font-bold uppercase tracking-widest animate-pulse">Secure Link</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Market Indices Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {indices.map((idx) => (
                            <div key={idx.name} className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col relative overflow-hidden group hover:border-white/20 transition-colors">
                                <div className="absolute top-0 right-0 w-12 h-12 bg-white/5 blur-[20px] rounded-full pointer-events-none group-hover:bg-prime-cyan/10 transition-colors"></div>
                                <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                    {idx.name}
                                    {idx.name === 'S&P 500' && <span className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></span>}
                                </div>
                                <div className="text-lg font-mono font-bold text-white mb-1 tracking-tight">{idx.value.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div className={`text-[9px] font-bold flex items-center gap-1 font-mono ${idx.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {idx.change >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} ({Math.abs(idx.percent).toFixed(2)}%)
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden mt-6">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-white font-black text-sm uppercase tracking-tighter font-display flex items-center gap-2">
                                Equity Performance
                                <span className="bg-white/5 px-2 py-0.5 rounded text-[8px] text-slate-500 font-mono tracking-wider border border-white/5">AES-256</span>
                            </h3>
                            <div className="flex gap-2">
                                {['1H', '1D', 'ALL'].map(r => (
                                    <button key={r} onClick={() => setChartRange(r as any)} className={`px-3 py-1 rounded text-[9px] font-black uppercase transition-all ${chartRange === r ? 'bg-white text-black' : 'text-slate-500 bg-black/40'}`}>{r}</button>
                                ))}
                            </div>
                        </div>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs><linearGradient id="eqG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00F0FF" stopOpacity={0.2}/><stop offset="100%" stopColor="#00F0FF" stopOpacity={0}/></linearGradient></defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis dataKey="time" hide />
                                    <YAxis stroke="#ffffff20" fontSize={9} axisLine={false} tickLine={false} tickFormatter={v=>`$${v.toLocaleString()}`} />
                                    <Tooltip contentStyle={{backgroundColor: '#000', border: 'none', borderRadius: '8px'}} />
                                    <Area type="monotone" dataKey="value" stroke="#00F0FF" strokeWidth={2} fill="url(#eqG)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-6">
                    <LocalMLWidget symbol={liveMarkets[0]?.symbol || 'TSLA'} currentPrice={liveMarkets[0]?.price || 175.80} />
                    
                    {/* Command Feed */}
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl h-80 overflow-hidden flex flex-col relative group hover:border-prime-cyan/30 transition-all duration-500">
                        <div className="absolute top-0 right-0 p-16 bg-prime-cyan/5 blur-[50px] rounded-full pointer-events-none group-hover:bg-prime-cyan/10 transition-colors"></div>
                        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 flex items-center gap-3 relative z-10">
                            <div className="relative">
                                <div className="w-2 h-2 bg-prime-cyan rounded-full animate-pulse"></div>
                                <div className="absolute inset-0 w-2 h-2 bg-prime-cyan rounded-full animate-ping opacity-50"></div>
                            </div>
                            Command Center Feed [E2EE]
                        </h4>
                        <div className="flex-1 overflow-y-auto space-y-3 font-mono text-[11px] scrollbar-hide relative z-10">
                            {stats.history.length === 0 ? (
                                <div className="text-slate-700 italic flex items-center gap-2">
                                    <span className="w-1 h-3 bg-slate-800 animate-pulse"></span>
                                    SYSTEM IDLE. AWAITING MARKET SIGNALS...
                                </div>
                            ) : (
                                stats.history.map(h => (
                                    <div key={h.id} className="flex gap-4 p-3 bg-white/[0.02] border border-white/5 rounded-xl group/item hover:bg-white/[0.05] transition-all hover:border-white/10">
                                        <span className="text-slate-600 font-bold">[{new Date(h.timestamp).toLocaleTimeString([], {hour12: false})}]</span>
                                        <span className={`flex-1 ${h.type === 'profit' ? 'text-emerald-400' : 'text-rose-400'} font-medium`}>{h.message}</span>
                                        <span className="font-black text-white tracking-tighter">${Math.abs(h.amount).toFixed(2)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                    </div>

                    <NewsFeed />
                    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-xl mt-6 overflow-hidden">
                        <h4 className="text-white font-black text-xs uppercase tracking-widest mb-6 border-b border-white/5 pb-4">Global Market Intelligence</h4>
                        <div className="h-[450px] -mx-2">
                            <MarketOverview 
                                key="dashboard-market-overview"
                                colorTheme="dark" 
                                height={450} 
                                width="100%" 
                                showFloatingTooltip
                                tabs={[
                                    {
                                        title: "Indices",
                                        symbols: [
                                            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
                                            { s: "FOREXCOM:NSXUSD", d: "US 100" },
                                            { s: "FOREXCOM:DJI", d: "Dow 30" },
                                            { s: "INDEX:NKY", d: "Nikkei 225" },
                                            { s: "INDEX:DEU40", d: "DAX Index" },
                                            { s: "FOREXCOM:UKXGBP", d: "UK 100" }
                                        ],
                                        originalTitle: "Indices"
                                    },
                                    {
                                        title: "Crypto",
                                        symbols: [
                                            { s: "BINANCE:BTCUSDT", d: "Bitcoin" },
                                            { s: "BINANCE:ETHUSDT", d: "Ethereum" },
                                            { s: "BINANCE:SOLUSDT", d: "Solana" },
                                            { s: "BINANCE:XRPUSDT", d: "Ripple" }
                                        ],
                                        originalTitle: "Crypto"
                                    }
                                ]}
                            />
                        </div>
                        <button onClick={() => onNavigate('Markets')} className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all">Deep Market Analysis</button>
                    </div>
                </div>
            </div>
        )}

        {/* Placeholder views for other pages */}
        {activePage === 'Settings' && (
            <SettingsPanel 
                userProfile={userProfile} 
                settings={settings} 
                onUpdateSettings={onUpdateSettings} 
            />
        )}

        {activePage === 'Ledger' && (
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl animate-[fadeIn_0.3s]">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4 mb-6">Transaction Ledger</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="pb-4">TX-ID</th>
                                <th className="pb-4">Date</th>
                                <th className="pb-4">Type</th>
                                <th className="pb-4">Amount</th>
                                <th className="pb-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-xs font-mono">
                            {!transactions || transactions.filter(t => t.userId === userProfile?.id).length === 0 ? (
                                <tr><td colSpan={5} className="py-8 text-center text-slate-600">No transactions found.</td></tr>
                            ) : (
                                transactions.filter(t => t.userId === userProfile?.id).map(t => (
                                    <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                                        <td className="py-4 text-slate-400">{t.id}</td>
                                        <td className="py-4 text-slate-400">{new Date(t.date).toLocaleString()}</td>
                                        <td className="py-4 uppercase text-[10px] font-bold">{t.type}</td>
                                        <td className={`py-4 font-bold ${t.type === 'deposit' || t.type === 'profit' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                            {t.type === 'deposit' || t.type === 'profit' ? '+' : '-'}${t.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </td>
                                        <td className="py-4">
                                            <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                                                t.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                t.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                                'bg-rose-500/10 text-rose-400'
                                            }`}>{t.status}</span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {activePage === 'Markets' && <MarketView />}
        {activePage === 'Strategies' && <Marketplace />}
        {activePage === 'Portfolio' && <Portfolio userProfile={userProfile} />}
        {activePage === 'Funds' && <Liquidity onOpenDepositModal={onOpenDepositModal} onOpenWithdrawModal={onOpenWithdrawModal} stats={stats} />}
        {activePage === 'Analysis' && <Intel />}
    </div>
  );
};

export default Dashboard;