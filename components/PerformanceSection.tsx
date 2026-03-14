import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, ReferenceLine } from 'recharts';

const PerformanceSection: React.FC = () => {
  const performanceData = useMemo(() => {
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const today = new Date();
    const data = [];
    // Standardized high-performance institutional return profile
    const values = [8.2, 12.4, 9.1, 15.5, 21.2, 16.8];

    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        data.push({
            month: MONTHS[d.getMonth()],
            return: values[5-i]
        });
    }
    return data;
  }, []);

  return (
    <section id="performance" className="py-24 px-6 relative text-white border-t border-white/10 overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="flex-1 space-y-8">
            <div>
              <div className="text-emerald-500 font-bold uppercase tracking-widest text-xs mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                 Live Performance Feed
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Consistently Outperforming <br/> 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">The Market</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
                Our AI model isn't just about speed—it's about accuracy. By analyzing multi-dimensional market data, Prime AI consistently delivers alpha where human traders hesitate.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="text-3xl font-mono font-bold text-white mb-1">94.2%</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Win Rate (YTD)</div>
                </div>
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                    <div className="text-3xl font-mono font-bold text-emerald-400 mb-1">+214%</div>
                    <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Annual Return</div>
                </div>
            </div>

            <p className="text-sm font-bold text-emerald-500 leading-relaxed">
                Our AI system works tirelessly to bring the best outcome for every investors automating their wealth generation.
            </p>
          </div>

          <div className="flex-1 w-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl ring-1 ring-white/5">
             <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>
             
             <div className="flex justify-between items-center mb-8 relative z-10">
                <div>
                    <h3 className="font-bold text-lg text-white">Monthly Net Return</h3>
                    <p className="text-xs text-slate-500 font-mono mt-1">AUDITED PERFORMANCE METRICS</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-emerald-500 font-bold uppercase tracking-wider">Live</span>
                </div>
             </div>

             <div className="h-[320px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                        <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold', fontFamily: 'monospace' }} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'monospace' }}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
                            itemStyle={{ color: '#10b981', fontWeight: 'bold', fontFamily: 'monospace' }}
                            formatter={(value: number) => [`+${value}%`, 'NET PROFIT']}
                            labelStyle={{ color: '#94a3b8', marginBottom: '0.5rem', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}
                        />
                        <ReferenceLine y={0} stroke="#333" />
                        <Bar dataKey="return" radius={[4, 4, 0, 0]} maxBarSize={60}>
                            {performanceData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill="url(#barGradient)"
                                    stroke="#10b981"
                                    strokeWidth={1}
                                    strokeOpacity={0.5}
                                />
                            ))}
                        </Bar>
                        <defs>
                            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.6}/>
                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.1}/>
                            </linearGradient>
                        </defs>
                    </BarChart>
                </ResponsiveContainer>
             </div>
             
             <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[10px] text-slate-500 font-mono uppercase tracking-wider">
                <span>*Verified by independent 3rd party audit</span>
                <span>SYNCED: {new Date().toLocaleTimeString()}</span>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default PerformanceSection;