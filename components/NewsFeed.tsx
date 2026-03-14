import React, { useState, useEffect } from 'react';

interface NewsItem {
  id: string;
  headline: string;
  source: string;
  timestamp: string;
  tickers: string[];
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

const MOCK_NEWS_SOURCE = [
  { headline: "Tesla FSD Beta v12.4 rollout showing 40% reduction in interventions", source: "Electrek", tickers: ["TSLA"], sentiment: "bullish" },
  { headline: "NVIDIA unveils new Blackwell B200 GPU architecture for AI training", source: "Bloomberg", tickers: ["NVDA"], sentiment: "bullish" },
  { headline: "Bitcoin faces resistance at $69k amid regulatory uncertainty in EU", source: "CoinDesk", tickers: ["BTC"], sentiment: "bearish" },
  { headline: "SpaceX Starship successful orbital insertion boosts investor confidence", source: "Reuters", tickers: ["TSLA", "SPCE"], sentiment: "bullish" },
  { headline: "Fed Chair signals potential rate cut pauses for Q3", source: "CNBC", tickers: ["SPY", "QQQ"], sentiment: "bearish" },
  { headline: "Apple and Google in talks to license Gemini AI for iPhone", source: "TechCrunch", tickers: ["AAPL", "GOOGL"], sentiment: "bullish" },
  { headline: "MicroStrategy acquires additional 12,000 BTC", source: "MicroStrategy PR", tickers: ["MSTR", "BTC"], sentiment: "bullish" },
  { headline: "SEC delays decision on Ethereum ETF applications", source: "WSJ", tickers: ["ETH"], sentiment: "neutral" },
];

const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLive, setIsLive] = useState(true);

  // Initialize with some data
  useEffect(() => {
    const initialNews = MOCK_NEWS_SOURCE.slice(0, 4).map((item, i) => ({
      ...item,
      id: `news-${Date.now()}-${i}`,
      timestamp: `${i + 2}m ago`,
      sentiment: item.sentiment as 'bullish' | 'bearish' | 'neutral'
    }));
    setNews(initialNews);
  }, []);

  // Simulate live incoming news
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const randomNews = MOCK_NEWS_SOURCE[Math.floor(Math.random() * MOCK_NEWS_SOURCE.length)];
      const newItem: NewsItem = {
        ...randomNews,
        id: `news-${Date.now()}`,
        timestamp: 'Just now',
        sentiment: randomNews.sentiment as 'bullish' | 'bearish' | 'neutral'
      };

      setNews(prev => [newItem, ...prev].slice(0, 6)); // Keep latest 6
    }, 8000); // New news every 8 seconds

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-xl relative overflow-hidden group h-full min-h-[300px]">
      {/* Background FX */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[80px] rounded-full pointer-events-none"></div>
      
      <div className="flex justify-between items-center mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-prime-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-prime-cyan"></span>
          </div>
          <h3 className="text-white font-black text-sm uppercase tracking-[0.2em] font-display">Global Intelligence</h3>
        </div>
        <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Live Wire</span>
            <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500' : 'bg-slate-700'}`}></div>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {news.map((item, index) => (
          <div 
            key={item.id} 
            className={`flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500 group/item ${index === 0 ? 'animate-[slideDown_0.5s_ease-out] border-l-2 border-l-prime-cyan' : ''}`}
          >
            <div className={`mt-1 min-w-[3px] h-3 rounded-full ${
                item.sentiment === 'bullish' ? 'bg-emerald-500' : 
                item.sentiment === 'bearish' ? 'bg-rose-500' : 'bg-slate-500'
            }`}></div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                 <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-prime-cyan uppercase tracking-wider bg-prime-cyan/10 px-1.5 py-0.5 rounded border border-prime-cyan/20">
                        {item.source}
                    </span>
                    {item.tickers.map(t => (
                        <span key={t} className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">${t}</span>
                    ))}
                 </div>
                 <span className="text-[9px] font-mono text-slate-600 shrink-0">{item.timestamp}</span>
              </div>
              <h4 className="text-xs md:text-sm font-bold text-slate-200 group-hover/item:text-white leading-relaxed line-clamp-2">
                  {item.headline}
              </h4>
            </div>
          </div>
        ))}
      </div>

      {/* Fade out bottom */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/60 to-transparent pointer-events-none z-20"></div>
    </div>
  );
};

export default NewsFeed;