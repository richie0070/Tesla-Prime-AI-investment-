import React from 'react';

const ResellerPage: React.FC = () => {
  return (
    <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">Global Reseller Program</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Join our global network of agents and earn lucrative commissions by introducing new investors to the Tesla Prime AI ecosystem.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Who Can Become an Agent?</h3>
            <p className="text-slate-400 leading-relaxed">
              Our reseller program is open to financial advisors, influencers, community leaders, and existing investors who want to build an additional income stream. No prior technical experience is required—we provide all the marketing materials and tracking tools.
            </p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Sales Process & Referral System</h3>
            <p className="text-slate-400 leading-relaxed mb-4">
              Upon registration, you receive a unique, encrypted referral link. Share this link with your network. When a new user registers and funds their account through your link, they are permanently mapped to your reseller profile.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Track your leads, conversions, and active network volume in real-time through the dedicated Reseller Panel in your dashboard.
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Commission Structure</h3>
            <p className="text-slate-400 leading-relaxed mb-6">
              Earn commissions across multiple product categories. Our multi-tier structure rewards high-performing agents.
            </p>
            <ul className="space-y-4">
              <li className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-slate-300">Tesla Shares (Direct Inv.)</span>
                <span className="font-mono text-prime-cyan font-bold">Up to 5%</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-slate-300">AI Bot Trading Volume</span>
                <span className="font-mono text-prime-cyan font-bold">0.05% of Vol.</span>
              </li>
              <li className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-slate-300">Real Estate Allocations</span>
                <span className="font-mono text-prime-cyan font-bold">3% Flat</span>
              </li>
              <li className="flex justify-between items-center pb-2">
                <span className="text-slate-300">Short-Term Plans</span>
                <span className="font-mono text-prime-cyan font-bold">4% of Deposit</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Payout Process</h3>
            <p className="text-slate-400 leading-relaxed">
              Commissions are calculated daily and credited directly to your Tesla Prime AI wallet. You can withdraw your earnings at any time or reinvest them into the platform's modules to compound your wealth.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button className="px-8 py-4 bg-prime-cyan text-black font-black font-display uppercase tracking-widest rounded-xl hover:bg-white transition-colors text-lg">
          Apply to Reseller Program
        </button>
      </div>
    </div>
  );
};

export default ResellerPage;
