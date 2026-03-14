
import React, { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: string;
  change: string;
  history: number[];
  type: 'stock' | 'crypto' | 'forex';
}

const INITIAL_DATA = [
  { symbol: 'NVDA', price: '892.45', change: '+2.45%', type: 'stock' },
  { symbol: 'BTC', price: '68,450.00', change: '+1.50%', type: 'crypto' },
  { symbol: 'EUR/USD', price: '1.0845', change: '-0.12%', type: 'forex' },
  { symbol: 'TSLA', price: '175.80', change: '-1.20%', type: 'stock' },
  { symbol: 'ETH', price: '3,890.00', change: '+0.95%', type: 'crypto' },
  { symbol: 'USD/JPY', price: '151.20', change: '+0.34%', type: 'forex' },
  { symbol: 'AMD', price: '178.32', change: '+1.12%', type: 'stock' },
  { symbol: 'GBP/USD', price: '1.2630', change: '+0.05%', type: 'forex' },
  { symbol: 'SOL', price: '145.20', change: '+5.40%', type: 'crypto' },
  { symbol: 'MSFT', price: '425.22', change: '+0.88%', type: 'stock' },
  { symbol: 'PLTR', price: '24.50', change: '+3.15%', type: 'stock' },
  { symbol: 'AI', price: '28.90', change: '+4.20%', type: 'stock' },
];

const generateHistory = (priceStr: string) => {
  const price = parseFloat(priceStr.replace(/,/g, ''));
  return Array.from({ length: 20 }, () => price * (1 + (Math.random() * 0.04 - 0.02)));
};

const INITIAL_STOCKS: StockData[] = INITIAL_DATA.map(s => ({
  ...s,
  history: generateHistory(s.price),
  type: s.type as any
}));

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  const width = 50;
  const height = 24;
  
  if (!data || data.length < 2) return <div style={{ width, height }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const normalizedY = (val - min) / range;
    const y = height - (normalizedY * height);
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible opacity-80">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const DataFeed: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>(INITIAL_STOCKS);

  useEffect(() => {
    let timeoutId: any;
    let isActive = true;

    const pushUpdate = () => {
      if (!isActive) return;

      setStocks(currentStocks => 
        currentStocks.map(stock => {
          const currentPrice = parseFloat(stock.price.replace(/,/g, ''));
          const currentChange = parseFloat(stock.change.replace('%', ''));
          const volatility = stock.type === 'crypto' ? 0.012 : 0.004;
          const fluctuation = (Math.random() * volatility * 2) - volatility;
          const newPriceVal = currentPrice * (1 + fluctuation);
          const newChangeVal = currentChange + (fluctuation * 100);
          const newHistory = [...stock.history.slice(1), newPriceVal];

          return {
            ...stock,
            price: newPriceVal.toLocaleString('en-US', { minimumFractionDigits: stock.type === 'forex' ? 4 : 2, maximumFractionDigits: stock.type === 'forex' ? 4 : 2 }),
            change: `${newChangeVal > 0 ? '+' : ''}${newChangeVal.toFixed(2)}%`,
            history: newHistory
          };
        })
      );

      const nextDelay = Math.random() * 2200 + 800;
      timeoutId = setTimeout(pushUpdate, nextDelay);
    };

    timeoutId = setTimeout(pushUpdate, 1000);
    return () => {
        isActive = false;
        clearTimeout(timeoutId);
    };
  }, []);

  const displayStocks = [...stocks, ...stocks, ...stocks];

  return (
    <section id="markets" className="bg-black/40 backdrop-blur-md border-y border-white/5 py-4 overflow-hidden relative select-none z-10">
      <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-[#020408] to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-[#020408] to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {displayStocks.map((stock, i) => {
           const isPositive = stock.change.startsWith('+');
           const color = isPositive ? '#10b981' : '#ef4444';
           
           return (
            <div key={i} className="flex items-center gap-4 px-8 border-r border-slate-800/50 min-w-[240px]">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-200 text-sm tracking-tight">{stock.symbol}</span>
                    <span className={`text-[8px] px-1 rounded uppercase font-black ${
                        stock.type === 'crypto' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                        stock.type === 'forex' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                        'bg-slate-800 text-slate-500'
                    }`}>{stock.type}</span>
                </div>
              </div>
              
              <Sparkline data={stock.history} color={color} />

              <div className="flex flex-col leading-none items-end min-w-[75px]">
                <span className="text-slate-400 text-sm font-mono font-bold">{stock.price}</span>
                <span className={`text-[10px] font-black transition-colors duration-300 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {stock.change}
                </span>
              </div>
            </div>
           );
        })}
      </div>
    </section>
  );
};

export default DataFeed;
