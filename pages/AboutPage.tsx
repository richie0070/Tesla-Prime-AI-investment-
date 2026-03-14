import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">About Tesla Prime AI</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          We are building a smarter financial future through innovation, automation, and a multi-income ecosystem model.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Platform Vision</h3>
          <p className="text-slate-400 leading-relaxed mb-4">
            Our vision is to democratize access to institutional-grade investment tools. We believe that advanced algorithmic trading, premium real estate, and direct equity participation should not be restricted to ultra-high-net-worth individuals.
          </p>
          <p className="text-slate-400 leading-relaxed">
            By leveraging artificial intelligence and blockchain technology, we are creating a transparent, efficient, and highly profitable ecosystem for investors worldwide.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h3 className="text-2xl font-bold font-display uppercase tracking-wide mb-4 text-prime-cyan">Product Philosophy</h3>
          <p className="text-slate-400 leading-relaxed mb-4">
            We build products that are intelligent, secure, and user-centric. Our philosophy centers on the "Multi-Income Ecosystem Model."
          </p>
          <p className="text-slate-400 leading-relaxed">
            Instead of relying on a single asset class, we provide a unified dashboard where users can seamlessly allocate capital across high-frequency trading bots, long-term equity holds, and tangible real estate assets, maximizing yield while mitigating risk.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-prime-cyan/10 to-blue-600/10 border border-prime-cyan/20 rounded-2xl p-12 text-center max-w-4xl mx-auto">
        <div className="text-5xl mb-6">🛡️</div>
        <h2 className="text-3xl font-bold font-display uppercase tracking-wide mb-4">Trust & Security</h2>
        <p className="text-slate-300 leading-relaxed mb-8">
          Security is the foundation of our platform. We employ military-grade encryption, multi-signature cold storage for digital assets, and strict KYC/AML compliance protocols. Your funds and personal data are protected by the most advanced digital infrastructure available.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-emerald-400">End-to-End Encryption</span>
          <span className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-emerald-400">Cold Storage Assets</span>
          <span className="px-4 py-2 bg-black/40 border border-white/10 rounded-lg text-xs font-mono text-emerald-400">Regulatory Compliance</span>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
