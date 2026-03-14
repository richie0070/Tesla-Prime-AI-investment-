import React from 'react';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

const chartData = Array.from({ length: 30 }, (_, i) => ({
  i,
  val: 150 + Math.random() * 50 + (i * 2)
}));

export default function TeslaProducts() {
  return (
    <section id="tesla-shares" className="py-24 md:py-32 relative border-t border-white/5 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,240,255,0.05),transparent_50%)] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Equity Portfolio</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            Tesla Shares <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-cyan to-blue-500">Long-Term Growth</span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Gain structured exposure to Tesla equity. Our automated portfolio management system balances your holdings, optimizing for long-term wealth generation through disciplined accumulation.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Direct tech equity exposure',
              'Automated dollar-cost averaging',
              'Real-time portfolio monitoring',
              'Structured allocation strategies'
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <span className="w-5 h-5 rounded-full bg-prime-cyan/10 flex items-center justify-center text-prime-cyan border border-prime-cyan/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <button className="px-8 py-4 bg-white text-black hover:bg-prime-cyan font-black text-xs rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 uppercase tracking-[0.2em]">
            View Equity Plans
          </button>
        </div>

        {/* Right Column - Dashboard Mockup */}
        <div className="relative">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative z-10">
            
            {/* Top Stats */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">TSLA Holdings</div>
                <div className="text-3xl font-mono text-white font-bold">425.50 <span className="text-lg text-slate-500">Shares</span></div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Portfolio Value</div>
                <div className="text-xl font-mono text-emerald-400 font-bold">$74,802.90</div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-48 w-full mb-8 relative">
              <div className="absolute inset-0 bg-gradient-to-t from-prime-cyan/5 to-transparent rounded-xl"></div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="tslaGradient" x1="0" y1="0" x2="0" y2="1">
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
                    fill="url(#tslaGradient)" 
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Average Buy Price</div>
                <div className="text-lg font-mono text-white font-bold">$142.30</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Projected 1Y Value</div>
                <div className="text-lg font-mono text-prime-cyan font-bold">$92,400</div>
              </div>
            </div>
            
            {/* Allocation Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                <span>Asset Allocation</span>
                <span>65% Equity / 35% Cash</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
                <div className="h-full bg-prime-cyan w-[65%]"></div>
                <div className="h-full bg-slate-600 w-[35%]"></div>
              </div>
            </div>

          </div>
          
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-prime-cyan/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>
      </div>
    </section>
  );
}
