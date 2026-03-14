import React, { useState, useEffect } from 'react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  platformConfig?: any;
}

const QUICK_AMOUNTS = [500, 1000, 5000, 10000];

const GATEWAYS = [
    { 
        id: 'crypto', 
        label: 'Crypto Transfer', 
        sub: 'Instant • Zero Fee', 
        icon: (
            <>
                <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/>
                <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/>
                <path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"/>
            </>
        )
    },
    { 
        id: 'bank', 
        label: 'Bank Wire / SWIFT', 
        sub: '1-3 Days • $25 Fee', 
        icon: <path d="M3 21h18M5 21v-7M19 21v-7M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3H4zM12 3v3"/> 
    },
    { 
        id: 'card', 
        label: 'Credit Card', 
        sub: '3.5% Fee • Instant', 
        icon: (
            <>
                <rect x="2" y="5" width="20" height="14" rx="2"/>
                <line x1="2" x2="22" y1="10" y2="10"/>
            </>
        )
    }
];

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onConfirm, platformConfig }) => {
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'card' | 'bank' | 'crypto'>('crypto');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [error, setError] = useState('');
  
  // Platform Banking Details (Fallback if config missing)
  const PLATFORM_BANK = {
      bankName: platformConfig?.bankName || "SILVERGATE INSTITUTIONAL",
      accountName: platformConfig?.accountName || "TESLA PRIME CUSTODY LLC",
      accountNumber: platformConfig?.accountNumber || "8829-1920-4821",
      swift: platformConfig?.swift || "SGBKUS33XXX",
      refCode: `QP-${Math.floor(Math.random() * 100000)}`
  };

  // Platform Crypto Details
  const PLATFORM_CRYPTO = {
      BTC: platformConfig?.btcAddress || "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      TRC20: platformConfig?.trcAddress || "TMuAwB8a5X9Y1273912838921",
      ERC20: platformConfig?.ethAddress || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
  };

  const [cryptoNetwork, setCryptoNetwork] = useState<'BTC' | 'ERC20' | 'TRC20'>('TRC20');
  const [hasCopied, setHasCopied] = useState<string | null>(null);

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setStatus('idle');
      setError('');
      setMethod('crypto');
    }
  }, [isOpen]);

  useEffect(() => {
      if (modalRef.current) {
          modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }, [status]);

  const handleCopy = (text: string, label: string) => {
      navigator.clipboard.writeText(text);
      setHasCopied(label);
      setTimeout(() => setHasCopied(null), 2000);
  };

  const handleSubmit = () => {
    const val = parseFloat(amount);
    if (isNaN(val) || val < 100) {
      setError('Minimum deposit required: $100.00 USD');
      return;
    }
    
    // Simulate API Call
    setStatus('processing');
    setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
            onConfirm(val);
        }, 1500);
    }, 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity" onClick={onClose}></div>
      
      <div ref={modalRef} className="relative z-10 w-full max-w-5xl max-h-[95vh] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden animate-[scaleIn_0.2s_ease-out] scrollbar-hide">
        
        {/* LEFT: Method Selection & Input */}
        <div className="w-full md:w-5/12 p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10 bg-black/40 flex flex-col relative md:overflow-y-auto scrollbar-hide">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prime-cyan via-blue-500 to-purple-600"></div>
             
             <h2 className="text-2xl font-black font-display text-white uppercase tracking-tighter mb-8">Inject Capital</h2>

             {/* Amount Input */}
             <div className="mb-8">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-display">Deposit Amount (USD)</label>
                <div className="relative group mt-3">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-3xl font-mono text-slate-500 group-focus-within:text-prime-cyan transition-colors">$</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent border-b-2 border-white/10 py-3 pl-8 text-4xl font-mono text-white font-bold focus:border-prime-cyan outline-none transition-all placeholder:text-slate-800"
                    />
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                    {QUICK_AMOUNTS.map(amt => (
                        <button key={amt} onClick={() => { setAmount(amt.toString()); setError(''); }} className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded text-[10px] font-bold text-slate-400 hover:text-white transition-all">
                            +${amt.toLocaleString()}
                        </button>
                    ))}
                </div>
             </div>

             {/* Method Select */}
             <div className="space-y-3">
                 <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-display">Select Gateway</label>
                 <div className="grid grid-cols-1 gap-3">
                    {GATEWAYS.map(m => (
                        <button
                            key={m.id}
                            onClick={() => setMethod(m.id as any)}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left group ${
                                method === m.id 
                                ? 'bg-prime-cyan text-black border-prime-cyan shadow-[0_0_20px_rgba(34,211,238,0.3)]' 
                                : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
                            }`}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={method === m.id ? 'text-black' : 'text-slate-500 group-hover:text-white'}>{m.icon}</svg>
                            <div>
                                <div className="text-xs font-black uppercase tracking-wide font-display">{m.label}</div>
                                <div className={`text-[9px] font-medium ${method === m.id ? 'text-slate-800' : 'text-slate-600'}`}>{m.sub}</div>
                            </div>
                        </button>
                    ))}
                 </div>
             </div>

             {/* Acceptable Payments List */}
             <div className="mt-auto pt-8">
                 <label className="text-[8px] font-black text-slate-600 uppercase tracking-widest font-display mb-2 block">Acceptable Payment Methods</label>
                 <div className="flex gap-2 flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all">
                     {['VISA', 'MC', 'AMEX', 'BTC', 'ETH', 'USDT', 'USDC', 'SWIFT', 'SEPA'].map(pm => (
                         <div key={pm} className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[9px] font-bold text-white">{pm}</div>
                     ))}
                 </div>
             </div>
        </div>

        {/* RIGHT: Platform Details Display */}
        <div className="w-full md:w-7/12 bg-transparent relative flex flex-col md:overflow-y-auto scrollbar-hide">
             <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white transition-colors z-20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
             </button>

             {status === 'success' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-12 animate-[fadeIn_0.5s_ease-out]">
                    <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                        <svg className="text-emerald-500 w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-2 font-display uppercase tracking-tight">Processing</h3>
                    <p className="text-slate-400 text-sm mb-8 font-medium max-w-xs mx-auto">Your deposit request has been logged. Funds will appear after network confirmation.</p>
                    <div className="w-full max-w-sm bg-white/5 rounded-xl p-4 border border-white/10">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-slate-500 uppercase tracking-wider font-bold">Status</span>
                            <span className="text-emerald-400 font-bold uppercase">Pending Confirmation</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-500 uppercase tracking-wider font-bold">Amount</span>
                            <span className="text-white font-mono font-bold">${parseFloat(amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
             ) : status === 'processing' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12">
                    <div className="w-16 h-16 border-4 border-slate-800 border-t-prime-cyan rounded-full animate-spin mb-6"></div>
                    <h3 className="text-white font-bold uppercase tracking-widest text-xs">Verifying Payment Gateway...</h3>
                </div>
             ) : (
                <div className="flex-1 flex flex-col p-8 md:p-12 overflow-y-auto scrollbar-hide">
                    {method === 'crypto' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s]">
                            <div className="text-center">
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Platform Wallet Address</h3>
                                <p className="text-slate-500 text-xs">Send only <span className="text-prime-cyan font-bold">{cryptoNetwork}</span> to this address.</p>
                            </div>

                            {/* Network Toggle */}
                            <div className="flex justify-center">
                                <div className="bg-white/5 p-1 rounded-xl flex gap-1 border border-white/10">
                                    {['TRC20', 'ERC20', 'BTC'].map(net => (
                                        <button 
                                            key={net}
                                            onClick={() => setCryptoNetwork(net as any)}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                                cryptoNetwork === net ? 'bg-prime-cyan text-black shadow-lg' : 'text-slate-500 hover:text-white'
                                            }`}
                                        >
                                            {net}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* QR & Address */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="bg-white p-4 rounded-2xl w-48 h-48 flex items-center justify-center shadow-2xl relative group mb-6">
                                    <div className="absolute inset-0 border-4 border-prime-cyan/20 rounded-2xl"></div>
                                    {/* Mock QR */}
                                    <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M3 3h6v6H3zM15 3h6v6h-6zM3 15h6v6H3zM15 15h6v6h-6zM9 3v6M15 3v6M3 9h18M9 15v6M15 15v6M3 15h18" strokeLinecap="square" strokeLinejoin="miter"/></svg>
                                    
                                    {/* Scan Line Animation */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-prime-cyan/20 to-transparent h-[10%] w-full animate-scan rounded-2xl pointer-events-none"></div>
                                </div>

                                <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-xl p-4 flex items-center gap-3 hover:border-prime-cyan/30 transition-colors">
                                    <div className="flex-1 overflow-hidden">
                                        <div className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1">Wallet Address ({cryptoNetwork})</div>
                                        <div className="text-white font-mono text-xs truncate">
                                            {PLATFORM_CRYPTO[cryptoNetwork]}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => handleCopy(PLATFORM_CRYPTO[cryptoNetwork], 'addr')} 
                                        className={`px-4 py-2 rounded-lg text-[9px] font-bold uppercase tracking-widest transition-all ${hasCopied === 'addr' ? 'bg-emerald-500 text-black' : 'bg-white/10 hover:bg-white/20 text-white'}`}
                                    >
                                        {hasCopied === 'addr' ? 'Copied' : 'Copy'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {method === 'bank' && (
                        <div className="space-y-6 animate-[fadeIn_0.3s]">
                            <div className="text-center mb-4">
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Platform Banking Details</h3>
                                <p className="text-slate-500 text-xs">Use the Reference Code to ensure instant credit.</p>
                            </div>

                            <div className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden">
                                {[
                                    { label: 'Beneficiary Name', val: PLATFORM_BANK.accountName },
                                    { label: 'Bank Name', val: PLATFORM_BANK.bankName },
                                    { label: 'Account / IBAN', val: PLATFORM_BANK.accountNumber },
                                    { label: 'SWIFT / BIC', val: PLATFORM_BANK.swift },
                                ].map((row, i) => (
                                    <div key={i} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{row.label}</span>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white text-xs font-mono font-bold select-all">{row.val}</span>
                                            <button onClick={() => handleCopy(row.val, `row-${i}`)} className={`transition-colors ${hasCopied === `row-${i}` ? 'text-emerald-500' : 'text-slate-600 hover:text-prime-cyan'}`}>
                                                {hasCopied === `row-${i}` ? (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                                ) : (
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-amber-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                                <div className="relative z-10">
                                    <div className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-1">Mandatory Reference Code</div>
                                    <div className="text-white font-mono font-bold tracking-wider">{PLATFORM_BANK.refCode}</div>
                                </div>
                                <button onClick={() => handleCopy(PLATFORM_BANK.refCode, 'ref')} className={`relative z-10 text-[9px] font-bold uppercase border px-3 py-1 rounded transition-all ${hasCopied === 'ref' ? 'bg-amber-500 text-black border-amber-500' : 'text-amber-500 hover:text-white border-amber-500/30 hover:bg-amber-500/20'}`}>
                                    {hasCopied === 'ref' ? 'Copied' : 'Copy Ref'}
                                </button>
                            </div>
                        </div>
                    )}

                    {method === 'card' && (
                        <div className="flex-1 flex flex-col justify-center items-center text-center animate-[fadeIn_0.3s]">
                            <div className="mb-8 p-6 bg-white/5 rounded-full border border-white/10 relative">
                                <div className="absolute inset-0 border border-white/10 rounded-full animate-[ping_3s_infinite]"></div>
                                <svg className="w-12 h-12 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-widest text-sm mb-4">Secure Gateway Redirect</h3>
                            <p className="text-slate-500 text-xs max-w-xs leading-relaxed mb-8">
                                You will be redirected to our secure PCI-DSS compliant payment processor (Stripe/MoonPay) to complete the transaction.
                            </p>
                            <div className="flex gap-4 opacity-50 grayscale hover:grayscale-0 transition-all mb-8">
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black uppercase">Visa</div>
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black uppercase">Master</div>
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center text-[8px] font-bold text-black uppercase">Amex</div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-center animate-shake">
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-wide">{error}</span>
                        </div>
                    )}

                    <div className="mt-auto pt-8">
                        <button 
                            onClick={handleSubmit}
                            className="w-full py-4 bg-white hover:bg-prime-cyan text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl shadow-lg transition-all hover:scale-[1.02] font-display"
                        >
                            {method === 'card' ? 'Proceed to Gateway' : 'I Have Sent Funds'}
                        </button>
                    </div>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;