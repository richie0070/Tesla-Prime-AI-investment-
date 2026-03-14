import React, { useState } from 'react';
import { ArrowDownToLine, ArrowUpFromLine, Wallet, TrendingUp, ShieldCheck, Activity, Zap, Layers } from 'lucide-react';

interface LiquidityProps {
  onOpenDepositModal?: () => void;
  onOpenWithdrawModal?: () => void;
  stats: any;
}

const Liquidity: React.FC<LiquidityProps> = ({ onOpenDepositModal, onOpenWithdrawModal, stats }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'pools'>('overview');

  const pools = [
    { name: 'USDT / USDC', apy: '12.5%', tvl: '$45.2M', risk: 'Low', icon: <Layers className="w-5 h-5 text-emerald-400" /> },
    { name: 'BTC / USDT', apy: '24.8%', tvl: '$128.5M', risk: 'Medium', icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { name: 'ETH / USDT', apy: '28.2%', tvl: '$86.1M', risk: 'Medium', icon: <Activity className="w-5 h-5 text-blue-400" /> },
    { name: 'SOL / USDT', apy: '45.6%', tvl: '$32.4M', risk: 'High', icon: <TrendingUp className="w-5 h-5 text-purple-400" /> },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-[fadeIn_0.3s]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter font-display flex items-center gap-3">
            <Wallet className="w-8 h-8 text-emerald-500" />
            Liquidity Management
          </h1>
          <p className="text-slate-400 mt-1 font-medium">Manage your assets, provide liquidity, and earn yield.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <button
            onClick={onOpenDepositModal}
            className="flex-1 md:flex-none px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold rounded-xl transition-colors border border-emerald-500/20 flex items-center justify-center gap-2"
          >
            <ArrowDownToLine className="w-4 h-4" />
            Deposit
          </button>
          <button
            onClick={onOpenWithdrawModal}
            className="flex-1 md:flex-none px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors border border-white/5 flex items-center justify-center gap-2"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            Withdraw
          </button>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
        <div className="relative z-10">
          <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Total Net Liquidity
          </div>
          <div className="text-5xl md:text-6xl font-black text-white tracking-tighter font-mono">
            ${stats.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Available Margin</div>
              <div className="text-lg font-bold text-white font-mono">${(stats.balance * 0.8).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">In Positions</div>
              <div className="text-lg font-bold text-white font-mono">${(stats.balance * 0.2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Yield Earned</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">+$1,245.50</div>
            </div>
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Daily Yield</div>
              <div className="text-lg font-bold text-emerald-400 font-mono">+$12.40</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-white/5 pb-px">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'overview' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Asset Overview
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full shadow-[0_-2px_8px_rgba(16,185,129,0.5)]"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('pools')}
          className={`pb-4 text-sm font-bold uppercase tracking-wider transition-colors relative ${
            activeTab === 'pools' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          Liquidity Pools
          {activeTab === 'pools' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full shadow-[0_-2px_8px_rgba(16,185,129,0.5)]"></div>
          )}
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">USDT</div>
                <div>
                  <div className="font-bold text-white">Tether</div>
                  <div className="text-xs text-slate-500">Stablecoin</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white font-mono">${(stats.balance * 0.6).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-slate-500">60% of portfolio</div>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4">
              <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold">BTC</div>
                <div>
                  <div className="font-bold text-white">Bitcoin</div>
                  <div className="text-xs text-slate-500">Store of Value</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white font-mono">${(stats.balance * 0.25).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-slate-500">25% of portfolio</div>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4">
              <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 border border-white/5">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">ETH</div>
                <div>
                  <div className="font-bold text-white">Ethereum</div>
                  <div className="text-xs text-slate-500">Smart Contracts</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-white font-mono">${(stats.balance * 0.15).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                <div className="text-xs text-slate-500">15% of portfolio</div>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pools' && (
        <div className="bg-slate-900 rounded-2xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/50">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pool</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Est. APY</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">TVL</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Risk Profile</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pools.map((pool, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/5">
                          {pool.icon}
                        </div>
                        <span className="font-bold text-white">{pool.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-emerald-400 font-bold font-mono">{pool.apy}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-slate-300 font-mono">{pool.tvl}</span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pool.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                        pool.risk === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {pool.risk}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button className="px-4 py-2 bg-slate-800 hover:bg-emerald-500 hover:text-white text-emerald-400 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/5 hover:border-emerald-500">
                        Provide Liquidity
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liquidity;
