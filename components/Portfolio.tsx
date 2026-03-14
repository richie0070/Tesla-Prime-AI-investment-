import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface PortfolioItem {
  id: string;
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
}

interface PortfolioProps {
  userProfile?: User;
}

export const Portfolio: React.FC<PortfolioProps> = ({ userProfile }) => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSymbol, setNewSymbol] = useState('');
  const [newShares, setNewShares] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    if (!userProfile) return;
    
    const fetchPortfolio = () => {
      try {
        const saved = localStorage.getItem(`prime_ai_portfolio_${userProfile.id}`);
        if (saved) {
          setItems(JSON.parse(saved));
        } else {
          // Initialize with some mock data for demo purposes
          const mockData = [
            { id: '1', symbol: 'TSLA', shares: 150, avgPrice: 165.20, currentPrice: 175.80 },
            { id: '2', symbol: 'NVDA', shares: 45, avgPrice: 750.00, currentPrice: 892.45 },
            { id: '3', symbol: 'BTC', shares: 0.5, avgPrice: 62000.00, currentPrice: 68450.00 }
          ];
          setItems(mockData);
          localStorage.setItem(`prime_ai_portfolio_${userProfile.id}`, JSON.stringify(mockData));
        }
      } catch (error) {
        console.error("Error fetching portfolio:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [userProfile]);

  useEffect(() => {
    if (!userProfile || loading) return;
    localStorage.setItem(`prime_ai_portfolio_${userProfile.id}`, JSON.stringify(items));
  }, [items, userProfile, loading]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile || !newSymbol || !newShares || !newPrice) return;

    const newItem: PortfolioItem = {
      id: `pos-${Date.now()}`,
      symbol: newSymbol.toUpperCase(),
      shares: parseFloat(newShares),
      avgPrice: parseFloat(newPrice),
      currentPrice: parseFloat(newPrice) * (1 + (Math.random() * 0.1 - 0.05)), // Mock current price
    };

    setItems([...items, newItem]);
    setNewSymbol('');
    setNewShares('');
    setNewPrice('');
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-mono">Loading portfolio data...</div>;
  }

  const totalValue = items.reduce((acc, item) => acc + (item.shares * item.currentPrice), 0);
  const totalCost = items.reduce((acc, item) => acc + (item.shares * item.avgPrice), 0);
  const totalProfit = totalValue - totalCost;
  const profitPercent = totalCost > 0 ? (totalProfit / totalCost) * 100 : 0;

  return (
    <div className="space-y-6 animate-[fadeIn_0.3s]">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter font-display mb-2">Investment Portfolio</h2>
          <p className="text-slate-400 text-sm font-mono">Manage and track your active positions.</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500 font-black uppercase tracking-widest mb-1">Total Value</div>
          <div className="text-3xl font-mono font-bold text-white">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div className={`text-sm font-bold font-mono ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({profitPercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl">
          <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4 mb-6">Current Positions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                <tr>
                  <th className="pb-4">Asset</th>
                  <th className="pb-4">Shares</th>
                  <th className="pb-4">Avg Price</th>
                  <th className="pb-4">Current Price</th>
                  <th className="pb-4">P/L</th>
                  <th className="pb-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs font-mono">
                {items.length === 0 ? (
                  <tr><td colSpan={6} className="py-8 text-center text-slate-600">No positions found. Add an asset to start tracking.</td></tr>
                ) : (
                  items.map(item => {
                    const profit = (item.currentPrice - item.avgPrice) * item.shares;
                    const percent = ((item.currentPrice - item.avgPrice) / item.avgPrice) * 100;
                    return (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 font-bold text-white">{item.symbol}</td>
                        <td className="py-4 text-slate-400">{item.shares}</td>
                        <td className="py-4 text-slate-400">${item.avgPrice.toFixed(2)}</td>
                        <td className="py-4 text-white">${item.currentPrice.toFixed(2)}</td>
                        <td className={`py-4 font-bold ${profit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {profit >= 0 ? '+' : ''}${profit.toFixed(2)} ({percent.toFixed(2)}%)
                        </td>
                        <td className="py-4 text-right">
                          <button onClick={() => handleDeleteItem(item.id)} className="text-rose-400 hover:text-rose-300 text-[10px] uppercase font-black tracking-widest">Close</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-xl h-fit">
          <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4 mb-6">Add Position</h3>
          <form onSubmit={handleAddItem} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Asset Symbol</label>
              <input 
                type="text" 
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                placeholder="e.g. TSLA"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-prime-cyan/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Shares / Amount</label>
              <input 
                type="number" 
                step="any"
                value={newShares}
                onChange={(e) => setNewShares(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-prime-cyan/50 transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Average Price ($)</label>
              <input 
                type="number" 
                step="any"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-prime-cyan/50 transition-colors"
                required
              />
            </div>
            <button type="submit" className="w-full py-3 mt-4 bg-prime-cyan text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-white transition-all">
              Add to Portfolio
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
