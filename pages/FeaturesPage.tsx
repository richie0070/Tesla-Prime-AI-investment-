import React from 'react';

const FeaturesPage: React.FC = () => {
  const features = [
    {
      title: "Tesla Shares Long-Term Investing",
      description: "Build wealth steadily with direct access to Tesla equity. Our platform offers fractional shares, automated dollar-cost averaging, and long-term holding strategies designed for maximum appreciation.",
      icon: "📈"
    },
    {
      title: "AI Bot Trading",
      description: "Deploy advanced algorithmic execution systems specifically calibrated for high-frequency volatility markets. Let our AI optimize your entry and exit points 24/7.",
      icon: "🤖"
    },
    {
      title: "Short-Term Investment Plans",
      description: "Access curated short-term opportunities with defined yield targets. Perfect for diversifying your portfolio and generating consistent returns over shorter time horizons.",
      icon: "⚡"
    },
    {
      title: "Real Estate Investment Access",
      description: "Participate in premium global real estate projects through our fractional ownership model. Enjoy passive income yields and property appreciation without the hassle of traditional management.",
      icon: "🏢"
    },
    {
      title: "Reseller Marketplace",
      description: "Join our global network of agents. Earn lucrative commissions by introducing new investors to the Tesla Prime AI ecosystem and building your own referral network.",
      icon: "🤝"
    },
    {
      title: "Wallet and Transaction System",
      description: "Manage your funds with our secure, multi-currency digital wallet. Enjoy instant deposits, seamless transfers across investment modules, and rapid withdrawals.",
      icon: "💳"
    },
    {
      title: "Fees and Transparency",
      description: "We believe in complete transparency. All fees are clearly displayed before you confirm any action, and you can track your complete fee history directly from your dashboard.",
      icon: "🔍"
    },
    {
      title: "Compliance and Security",
      description: "Your assets are protected by institutional-grade security protocols, end-to-end encryption, and strict regulatory compliance frameworks to ensure peace of mind.",
      icon: "🛡️"
    }
  ];

  return (
    <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">Platform Features</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          Explore the full ecosystem of Tesla Prime AI. From long-term investing to AI bot trading and real estate participation, we provide the tools you need to build smarter wealth.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-prime-cyan/30 transition-all group">
            <div className="text-4xl mb-6">{feature.icon}</div>
            <h3 className="text-xl font-bold font-display uppercase tracking-wide mb-4 group-hover:text-prime-cyan transition-colors">{feature.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesPage;
