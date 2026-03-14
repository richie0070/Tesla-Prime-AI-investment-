import React from 'react';
import { useNavigate } from 'react-router-dom';

const ResellerSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section id="reseller" className="py-24 md:py-32 relative border-t border-white/5 bg-transparent overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column - Reseller Dashboard Mockup */}
        <div className="relative order-2 lg:order-1">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-2xl relative z-10">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-8 pb-6 border-b border-white/5">
                <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Agent Status</div>
                    <div className="text-white font-bold font-display flex items-center gap-2">
                        <span className="text-amber-400">★</span> Elite Partner
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Total Earned</div>
                    <div className="text-xl font-mono text-emerald-400 font-bold">$14,250.00</div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Active Referrals</div>
                    <div className="text-3xl font-mono text-white font-bold">124</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Conversion Rate</div>
                    <div className="text-3xl font-mono text-white font-bold">18.2%</div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-4">Recent Commissions</div>
                <div className="space-y-3">
                    {[
                        { user: 'alex_m***', plan: 'Prime Cycle', amount: '+$250.00', time: '2h ago' },
                        { user: 'sarah_t***', plan: 'Tesla Equity', amount: '+$1,420.00', time: '5h ago' },
                        { user: 'david_k***', plan: 'Alpha Cycle', amount: '+$50.00', time: '1d ago' }
                    ].map((activity, i) => (
                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-white/[0.02] border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs text-white font-bold">
                                    {activity.user[0].toUpperCase()}
                                </div>
                                <div>
                                    <div className="font-mono text-sm text-white">{activity.user}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-widest">{activity.plan}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-mono text-sm text-emerald-400 font-bold">{activity.amount}</div>
                                <div className="text-[10px] text-slate-500">{activity.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Referral Link */}
            <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between gap-4">
                <div className="truncate font-mono text-xs text-slate-400">https://teslaprime.ai/ref/elite_partner_77</div>
                <button className="px-4 py-2 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded hover:bg-prime-cyan transition-colors shrink-0">
                    Copy Link
                </button>
            </div>

          </div>
          
          {/* Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-amber-500/10 blur-[100px] rounded-full pointer-events-none -z-10"></div>
        </div>

        {/* Right Column - Content */}
        <div className="order-1 lg:order-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-6">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner Network</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
            Global Reseller <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-cyan to-blue-500">Program</span>
          </h2>
          
          <p className="text-slate-400 text-lg leading-relaxed mb-8">
            Build a lucrative active income stream by joining our exclusive agent network. Distribute premium financial products and earn high-tier commissions on every successful referral.
          </p>

          <ul className="space-y-4 mb-10">
            {[
              'Multi-tier commission structure',
              'Real-time tracking & instant payouts',
              'Professional marketing materials provided',
              'Dedicated partner support channel'
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
            onClick={() => { navigate('/reseller'); window.scrollTo(0, 0); }}
            className="px-8 py-4 bg-white text-black hover:bg-prime-cyan font-black text-xs rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all hover:-translate-y-1 uppercase tracking-[0.2em]"
          >
            Become an Agent
          </button>
        </div>

      </div>
    </section>
  );
};

export default ResellerSection;
