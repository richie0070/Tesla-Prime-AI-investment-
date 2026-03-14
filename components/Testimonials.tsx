import React from 'react';

const REVIEWS = [
  {
    name: 'Marcus Chen',
    role: 'Hedge Fund Principal',
    quote: "I manage a small family office. Tesla Prime has outperformed our manual traders for 6 consecutive months. The V4.2 core is a beast.",
    initial: 'M',
    proof: '+214% YTD',
    type: 'Investor Story'
  },
  {
    name: 'James Rodriguez',
    role: 'Day Trader',
    quote: "The Titan Momentum X bot is incredible. 68% win rate on high-volatility scalps is unheard of in this market condition.",
    initial: 'J',
    proof: '68% Win Rate',
    type: 'Bot User Experience'
  },
  {
    name: 'Sarah Williams',
    role: 'Global Reseller',
    quote: "The agent commerce model is flawless. Commission visibility is transparent, and the payout process is instant. A true premium income channel.",
    initial: 'S',
    proof: '$45k+ Commissions',
    type: 'Reseller Success'
  }
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 px-6 relative overflow-hidden text-white bg-transparent">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Live Client Feed</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">Proof of Performance</h2>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">
            Join over 50,000+ investors utilizing V4.2 Core to automate their wealth generation. Real results from verified institutional and retail accounts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review, i) => (
            <div key={i} className="bg-black/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl hover:border-white/20 transition-all duration-300 relative group flex flex-col h-full shadow-lg">
              <div className="absolute top-6 right-8 text-6xl font-serif text-white/5 group-hover:text-white/10 transition-colors pointer-events-none">"</div>
              
              <div className="text-[10px] text-prime-cyan font-bold uppercase tracking-widest mb-6">
                {review.type}
              </div>

              <p className="text-slate-300 leading-relaxed relative z-10 text-sm font-medium flex-1 mb-8">
                {review.quote}
              </p>

              <div className="flex items-center justify-between pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-black rounded-full flex items-center justify-center font-black text-sm border border-white/10 text-white shadow-inner">
                    {review.initial}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{review.name}</div>
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{review.role}</div>
                  </div>
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                    {review.proof}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;