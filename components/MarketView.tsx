import React, { useState } from 'react';
import { AdvancedRealTimeChart, TickerTape, MarketOverview, SymbolInfo } from 'react-ts-tradingview-widgets';

export const MarketView: React.FC = () => {
    const [activeSymbol, setActiveSymbol] = useState('NASDAQ:TSLA');

    const popularSymbols = [
        { symbol: 'NASDAQ:TSLA', name: 'Tesla' },
        { symbol: 'NASDAQ:AAPL', name: 'Apple' },
        { symbol: 'NASDAQ:NVDA', name: 'Nvidia' },
        { symbol: 'BINANCE:BTCUSDT', name: 'Bitcoin' },
        { symbol: 'BINANCE:ETHUSDT', name: 'Ethereum' },
        { symbol: 'OANDA:EURUSD', name: 'EUR/USD' },
        { symbol: 'OANDA:XAUUSD', name: 'Gold' },
    ];

    return (
        <div className="flex flex-col gap-6 animate-[fadeIn_0.3s]">
            {/* Header / Ticker Tape */}
            <div className="w-full overflow-hidden rounded-2xl border border-white/10 bg-prime-panel">
                <TickerTape key="marketview-ticker-tape" colorTheme="dark" displayMode="adaptive" />
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main Chart Area */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Symbol Selector */}
                    <div className="flex flex-wrap gap-2">
                        {popularSymbols.map((s) => (
                            <button
                                key={s.symbol}
                                onClick={() => setActiveSymbol(s.symbol)}
                                className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                                    activeSymbol === s.symbol
                                        ? 'bg-prime-cyan text-black'
                                        : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                                }`}
                            >
                                {s.name}
                            </button>
                        ))}
                    </div>

                    {/* Advanced Chart */}
                    <div className="h-[500px] lg:h-[600px] w-full rounded-3xl overflow-hidden border border-white/10 bg-prime-panel">
                        <AdvancedRealTimeChart 
                            key={`chart-${activeSymbol}`}
                            symbol={activeSymbol} 
                            theme="dark" 
                            autosize 
                            hide_side_toolbar={false}
                            allow_symbol_change={true}
                            save_image={false}
                            backgroundColor="#0a0a0a"
                        />
                    </div>
                </div>

                {/* Sidebar / Market Overview */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6">
                    <div className="h-[400px] w-full rounded-3xl overflow-hidden border border-white/10 bg-prime-panel">
                        <MarketOverview 
                            key="marketview-market-overview"
                            colorTheme="dark" 
                            height={400} 
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
                    
                    <div className="h-[180px] w-full rounded-3xl overflow-hidden border border-white/10 bg-prime-panel">
                        <SymbolInfo 
                            key={`info-${activeSymbol}`}
                            symbol={activeSymbol} 
                            colorTheme="dark" 
                            autosize 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MarketView;
