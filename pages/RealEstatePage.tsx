import React from 'react';

const RealEstatePage: React.FC = () => {
  return (
    <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">Real Estate Participation</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Access premium real estate investments globally through our fractional ownership model. Diversify your portfolio with tangible assets.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Fractional Investment Model</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Our platform tokenizes high-value real estate properties, allowing you to purchase fractional shares. This lowers the barrier to entry, enabling you to build a diversified real estate portfolio without the need for massive capital upfront.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><span className="text-prime-cyan">✓</span> Low minimum investment thresholds</li>
            <li className="flex items-center gap-2"><span className="text-prime-cyan">✓</span> Instant liquidity through our internal marketplace</li>
            <li className="flex items-center gap-2"><span className="text-prime-cyan">✓</span> No property management headaches</li>
          </ul>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Yield & Appreciation</h3>
          <p className="text-slate-400 leading-relaxed mb-6">
            Benefit from dual-income streams: regular rental yields distributed directly to your wallet, and long-term capital appreciation as property values increase over time.
          </p>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-2"><span className="text-prime-cyan">✓</span> Monthly or quarterly yield distributions</li>
            <li className="flex items-center gap-2"><span className="text-prime-cyan">✓</span> Automated reinvestment options</li>
            <li className="flex items-center gap-2"><span className="text-prime-cyan">✓</span> Transparent valuation updates</li>
          </ul>
        </div>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-6">Project Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl mb-4">🏢</div>
            <h4 className="font-bold uppercase tracking-wide mb-2">Commercial</h4>
            <p className="text-xs text-slate-400">High-yield office spaces and retail centers in prime urban locations.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl mb-4">🏠</div>
            <h4 className="font-bold uppercase tracking-wide mb-2">Residential</h4>
            <p className="text-xs text-slate-400">Premium residential complexes with stable, long-term rental demand.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="text-3xl mb-4">🏭</div>
            <h4 className="font-bold uppercase tracking-wide mb-2">Industrial</h4>
            <p className="text-xs text-slate-400">Logistics hubs and warehouses supporting the growing e-commerce sector.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-prime-cyan/10 to-blue-600/10 border border-prime-cyan/20 rounded-2xl p-8 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-display uppercase tracking-wide mb-4">Dashboard Visibility & Transparency</h2>
        <p className="text-slate-300 mb-6">
          Track your real estate portfolio alongside your Tesla shares and AI bot performance. View property details, historical yields, occupancy rates, and upcoming distributions all from a single, unified interface.
        </p>
      </div>
    </div>
  );
};

export default RealEstatePage;
