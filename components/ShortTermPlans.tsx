import React from 'react';

const PLANS = [
  {
    name: 'Alpha Cycle',
    duration: '7 Days',
    yield: '4.5%',
    min: '$500',
    max: '$5,000',
    highlight: false
  },
  {
    name: 'Prime Cycle',
    duration: '14 Days',
    yield: '10.2%',
    min: '$1,000',
    max: '$25,000',
    highlight: true
  },
  {
    name: 'Institutional',
    duration: '30 Days',
    yield: '24.5%',
    min: '$10,000',
    max: 'Unlimited',
    highlight: false
  }
];

const ShortTermPlans: React.FC = () => {
  return (
    <section id="short-term" className="py-24 md:py-32 relative border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 md:mb-24">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fixed Yield</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
                Short-Term Investment Plans
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg font-medium">
                Accelerate capital growth through fixed-cycle smart contracts. Predictable returns with high liquidity.
            </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto items-center">
            {PLANS.map((plan, i) => (
                <div 
                    key={i} 
                    className={`relative p-8 rounded-[2rem] border transition-all duration-500 flex flex-col ${
                        plan.highlight 
                        ? 'bg-white/5 border-prime-cyan/50 shadow-[0_0_50px_rgba(0,240,255,0.1)] md:-translate-y-4' 
                        : 'bg-black/40 border-white/10 hover:border-white/20'
                    }`}
                >
                    {plan.highlight && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-prime-cyan text-black text-[10px] font-black uppercase tracking-widest rounded-full">
                            Most Popular
                        </div>
                    )}
                    
                    <div className="text-center mb-8">
                        <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                        <div className="text-sm text-slate-400 font-medium mb-6">{plan.duration} Lock Period</div>
                        <div className="flex items-baseline justify-center gap-1">
                            <span className="text-5xl font-black text-white tracking-tighter">{plan.yield}</span>
                            <span className="text-sm text-slate-400 font-bold">ROI</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8 flex-1">
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-xs text-slate-400">Min Deposit</span>
                            <span className="text-sm font-mono text-white font-bold">{plan.min}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-xs text-slate-400">Max Deposit</span>
                            <span className="text-sm font-mono text-white font-bold">{plan.max}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-white/5">
                            <span className="text-xs text-slate-400">Principal Return</span>
                            <span className="text-sm font-bold text-emerald-400">Included</span>
                        </div>
                    </div>

                    <button className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
                        plan.highlight
                        ? 'bg-prime-cyan text-black hover:bg-white shadow-[0_0_20px_rgba(0,240,255,0.3)]'
                        : 'bg-white/10 text-white hover:bg-white hover:text-black'
                    }`}>
                        Select Plan
                    </button>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
};

export default ShortTermPlans;
