import React from 'react';
import { useNavigate } from 'react-router-dom';

const RealEstateSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="real-estate" className="py-24 md:py-32 relative border-t border-white/5 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column - Content */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Asset Diversification</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            Real Estate <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-cyan to-blue-500">Participation</span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Diversify your portfolio with fractional access to premium real estate development projects. Generate stable passive income yields and benefit from long-term property appreciation without the traditional management overhead.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Fractional ownership model',
              'Monthly yield distributions',
              'Commercial & residential portfolios',
              'Institutional-grade asset selection'
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3 text-sm text-slate-300 font-medium">
                <span className="w-5 h-5 rounded-full bg-prime-cyan/10 flex items-center justify-center text-prime-cyan border border-prime-cyan/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </span>
                {benefit}
              </li>
            ))}
          </ul>

          <button 
            onClick={() => { navigate('/real-estate'); window.scrollTo(0, 0); }}
            className="px-8 py-4 bg-white text-black hover:bg-prime-cyan font-black text-xs rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 uppercase tracking-[0.2em]"
          >
            Explore Properties
          </button>
        </div>

        {/* Right Column - Property Mockup */}
        <div className="relative">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 shadow-2xl relative z-10">
            
            {/* Image Container */}
            <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-6">
              <img 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800" 
                alt="Premium Commercial Real Estate" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              {/* Tags */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded text-[9px] font-bold text-white uppercase tracking-widest">
                  Commercial
                </span>
                <span className="px-3 py-1 bg-prime-cyan/20 backdrop-blur-md border border-prime-cyan/30 rounded text-[9px] font-bold text-prime-cyan uppercase tracking-widest">
                  Funding Open
                </span>
              </div>

              {/* Location */}
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-black text-white tracking-tight mb-1">Aura Tower</h3>
                <div className="flex items-center gap-1 text-slate-300 text-xs font-medium">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  Downtown Financial District
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Target Yield</div>
                <div className="text-lg font-mono text-emerald-400 font-bold">12.5%</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Term Length</div>
                <div className="text-lg font-mono text-white font-bold">24 Mo</div>
              </div>
              <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-center">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Min Entry</div>
                <div className="text-lg font-mono text-white font-bold">$5,000</div>
              </div>
            </div>

            {/* Progress */}
            <div>
              <div className="flex justify-between text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">
                <span>Funding Progress</span>
                <span className="text-prime-cyan">85% Funded</span>
              </div>
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-prime-cyan w-[85%]"></div>
              </div>
            </div>

          </div>
          
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-prime-cyan/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>

      </div>
    </section>
  );
};

export default RealEstateSection;
