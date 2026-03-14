import React from 'react';

const FeesPage: React.FC = () => {
  const feeCategories = [
    {
      title: "Investment Fees",
      description: "Applied when allocating funds to long-term Tesla shares or short-term plans.",
      rate: "0.5% - 1.5%",
      details: "Varies based on the investment tier and duration. Clearly displayed before confirmation."
    },
    {
      title: "Trading Fees",
      description: "Applied to AI bot automated trades and manual executions.",
      rate: "0.1% per trade",
      details: "High-frequency trading benefits from volume discounts. No hidden spreads."
    },
    {
      title: "Wallet Fees",
      description: "Internal transfers between your own modules.",
      rate: "0.00%",
      details: "Moving funds between your trading wallet and real estate portfolio is completely free."
    },
    {
      title: "Withdrawal Fees",
      description: "Applied when transferring funds out of the Tesla Prime AI ecosystem to external accounts.",
      rate: "Flat $25 or 1%",
      details: "Whichever is higher. Network fees for crypto withdrawals are calculated dynamically."
    },
    {
      title: "Real Estate Fees",
      description: "Management and performance fees for fractional property investments.",
      rate: "2% Management",
      details: "Plus a 10% performance fee on yields above the baseline target."
    },
    {
      title: "Reseller Commission Deductions",
      description: "Standard processing fee applied to agent commission payouts.",
      rate: "2.5%",
      details: "Deducted automatically before the final commission is credited to your wallet."
    }
  ];

  return (
    <div className="relative z-10 pt-32 pb-20 px-6 max-w-7xl mx-auto text-white">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-display font-black uppercase tracking-tight mb-6">Transparent Fees</h1>
        <p className="text-slate-400 text-lg max-w-3xl mx-auto">
          We believe in complete transparency. Our fee structure is simple, straightforward, and visible before you confirm any action. No hidden costs.
        </p>
      </div>
      
      <div className="bg-prime-cyan/10 border border-prime-cyan/30 rounded-2xl p-8 mb-16 text-center max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold font-display uppercase tracking-wide text-prime-cyan mb-4">Transparent Fees Built into Every Financial Action</h2>
        <p className="text-slate-300">
          Fees are visible before confirmation. You can track all fees directly from your dashboard. Multiple fee categories exist depending on the module you use, and your complete fee history is always accessible. Promotional discounts may apply where configured.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {feeCategories.map((fee, index) => (
          <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
            <h3 className="text-xl font-bold font-display uppercase tracking-wide mb-2 text-white">{fee.title}</h3>
            <div className="text-3xl font-mono font-bold text-prime-cyan mb-4">{fee.rate}</div>
            <p className="text-slate-400 text-sm mb-4">{fee.description}</p>
            <p className="text-slate-500 text-xs italic">{fee.details}</p>
          </div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-display font-black uppercase tracking-tight mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">Are there any monthly subscription fees?</h4>
            <p className="text-slate-400 text-sm">No, Tesla Prime AI does not charge monthly subscription fees for basic platform access. You only pay for the specific investment modules and services you use.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">How are AI bot trading fees calculated?</h4>
            <p className="text-slate-400 text-sm">Trading fees are calculated as a percentage of the total trade volume. The standard rate is 0.1%, but high-volume traders may qualify for reduced rates.</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold mb-2">Can I view my fee history?</h4>
            <p className="text-slate-400 text-sm">Yes, your complete fee history is available in the Ledger section of your dashboard. Every deduction is itemized and categorized for full transparency.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeesPage;
