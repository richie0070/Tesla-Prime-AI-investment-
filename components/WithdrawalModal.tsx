import React, { useState, useEffect } from 'react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (amount: number, method: string, details: string, note: string) => void;
  availableBalance: number;
}

const PAYOUT_METHODS = [
    { 
        id: 'wire', 
        label: 'Wire Transfer', 
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10v6M12 15a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
                <path d="M12 3v4"/>
            </svg>
        )
    },
    { 
        id: 'crypto', 
        label: 'Crypto Transfer', 
        icon: (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
                <path d="M12 18V6"/>
            </svg>
        )
    }
];

const WithdrawalModal: React.FC<WithdrawalModalProps> = ({ isOpen, onClose, onConfirm, availableBalance }) => {
  const [step, setStep] = useState(1); // 1: Input, 2: PIN/Review, 3: Processing, 4: Success
  const [amount, setAmount] = useState<string>('');
  const [method, setMethod] = useState<'wire' | 'crypto' | 'instant'>('wire');
  const [status, setStatus] = useState<'idle' | 'verifying' | 'processing' | 'success'>('idle');
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  
  // Fee State
  const [fee, setFee] = useState(0);
  const [netAmount, setNetAmount] = useState(0);

  // Linking State
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  // Saved Data (In a real app, this would come from User Profile)
  const [savedWires, setSavedWires] = useState([
      { id: 'w1', name: 'Chase Checking', number: '****8829', bank: 'JPMorgan Chase', country: 'USA' }
  ]);
  const [savedWallets, setSavedWallets] = useState([
      { id: 'c1', label: 'Ledger Vault', address: '0x71C...976F', network: 'ERC20', token: 'USDT' }
  ]);

  const [selectedWireId, setSelectedWireId] = useState<string>(savedWires[0]?.id || '');
  const [selectedWalletId, setSelectedWalletId] = useState<string>(savedWallets[0]?.id || '');

  // New Link Inputs
  const [newBankDetails, setNewBankDetails] = useState({ bankName: '', accountName: '', accountNumber: '', swift: '' });
  const [newWalletDetails, setNewWalletDetails] = useState({ label: '', address: '', network: 'ERC20' });
  
  // Security
  const [pin, setPin] = useState(['', '', '', '']);

  const modalRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount('');
      setStep(1);
      setStatus('idle');
      setError('');
      setMethod('wire');
      setPin(['', '', '', '']);
      setNote('');
      setIsAddingNew(false);
    }
  }, [isOpen]);

  useEffect(() => {
      if (modalRef.current) {
          modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
  }, [step]);

  // Fee Calculation Effect
  useEffect(() => {
      const val = parseFloat(amount) || 0;
      let calculatedFee = 0;

      if (val > 0) {
          if (method === 'wire') calculatedFee = 25.00; // Flat fee
          if (method === 'crypto') calculatedFee = val * 0.01; // 1%
          if (method === 'instant') calculatedFee = val * 0.015; // 1.5%
      }

      setFee(calculatedFee);
      setNetAmount(val > 0 ? Math.max(0, val - calculatedFee) : 0);
  }, [amount, method]);

  const getDestinationLabel = () => {
      if (method === 'wire') {
          const w = savedWires.find(x => x.id === selectedWireId);
          return w ? `${w.bank} (${w.number})` : 'Select Destination';
      } else if (method === 'crypto') {
          const c = savedWallets.find(x => x.id === selectedWalletId);
          return c ? `${c.network} - ${c.address}` : 'Select Destination';
      }
      return 'Instant Card Transfer';
  };

  if (!isOpen) return null;

  const handleMaxClick = () => {
    setAmount(availableBalance.toFixed(2));
    setError('');
  };

  const handlePinChange = (index: number, value: string) => {
      if (value.length > 1) return;
      if (value && !/^\d+$/.test(value)) return;
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      // Auto focus next
      if (value && index < 3) {
          document.getElementById(`pin-${index + 1}`)?.focus();
      }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !pin[index] && index > 0) {
          document.getElementById(`pin-${index - 1}`)?.focus();
      }
  };

  const handlePinPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text').slice(0, 4).replace(/\D/g, '');
      if (pastedData) {
          const newPin = [...pin];
          for (let i = 0; i < pastedData.length; i++) {
              newPin[i] = pastedData[i];
          }
          setPin(newPin);
          const nextIndex = Math.min(pastedData.length, 3);
          if (pastedData.length === 4) {
              document.getElementById(`pin-3`)?.focus();
          } else {
              document.getElementById(`pin-${nextIndex}`)?.focus();
          }
      }
  };

  const handleSaveDestination = () => {
      if (method === 'wire') {
          if (!newBankDetails.bankName || !newBankDetails.accountNumber) { setError('Bank Name and Account Number are required.'); return; }
          const newId = `w-${Date.now()}`;
          setSavedWires(prev => [...prev, { id: newId, name: newBankDetails.accountName || 'New Account', number: `****${newBankDetails.accountNumber.slice(-4)}`, bank: newBankDetails.bankName, country: 'Intl' }]);
          setSelectedWireId(newId);
      } else {
          if (!newWalletDetails.address) { setError('Wallet address is required.'); return; }
          const newId = `c-${Date.now()}`;
          setSavedWallets(prev => [...prev, { id: newId, label: newWalletDetails.label || 'New Wallet', address: `${newWalletDetails.address.slice(0,6)}...${newWalletDetails.address.slice(-4)}`, network: newWalletDetails.network, token: 'USDT' }]);
          setSelectedWalletId(newId);
      }
      setIsAddingNew(false);
      setError('');
  };

  const handleInitiate = () => {
      const val = parseFloat(amount);
      if (isNaN(val) || val <= 0) { setError("Please enter a valid amount."); return; }
      if (val > availableBalance) { setError("Insufficient funds."); return; }
      if (isAddingNew) { setError("Please save or cancel new destination entry."); return; }
      
      if (method === 'wire' && !selectedWireId) { setError("Please select a destination bank account."); return; }
      if (method === 'crypto' && !selectedWalletId) { setError("Please select a destination wallet."); return; }
      
      setError('');
      setStep(2); // Move to PIN
  };

  const handlePinSubmit = () => {
      if (pin.join('').length !== 4) {
          setError("Please enter the 4-digit Admin PIN.");
          return;
      }
      // Simulate API verification
      setStatus('verifying');
      setTimeout(() => {
          if (pin.join('') === '0000') { // Mock PIN failure
               setStatus('idle');
               setError("Invalid Administrative PIN. Access Denied.");
          } else {
               setStep(3); // Move to Processing
               processWithdrawal();
          }
      }, 1500);
  };

  const processWithdrawal = () => {
      setStatus('processing');
      setTimeout(() => {
        setStep(4); // Success
        setStatus('success');
        setTimeout(() => {
            onConfirm(parseFloat(amount), method, getDestinationLabel(), note);
        }, 2000);
      }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl transition-opacity" onClick={onClose}></div>
      <div ref={modalRef} className="relative z-10 w-full max-w-4xl max-h-[95vh] bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden animate-[scaleIn_0.2s_ease-out] scrollbar-hide">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-600"></div>

        {/* LEFT COLUMN: Input */}
        <div className="w-full md:w-5/12 p-6 md:p-10 border-b md:border-b-0 md:border-r border-white/10 flex flex-col bg-black/40 relative md:overflow-y-auto scrollbar-hide">
             <div className="absolute top-0 right-0 p-32 bg-amber-500/5 blur-[80px] rounded-full pointer-events-none"></div>
             <h2 className="text-2xl font-black font-display text-white uppercase tracking-tighter mb-8">Withdraw Funds</h2>
             
             <div className="mb-8 p-4 bg-white/5 rounded-2xl border border-white/5">
                 <div className="flex justify-between items-center mb-1"><span className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-display">Available Liquidity</span><button onClick={handleMaxClick} className="text-[9px] font-bold text-amber-500 uppercase tracking-widest hover:text-white transition-colors">Max Amount</button></div>
                 <div className="text-2xl font-mono font-bold text-white tracking-tight">${availableBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
             </div>

             <div className="mb-8 relative z-10">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-display">Withdraw Amount (USD)</label>
                 <div className="relative group mt-2">
                     <span className="absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-mono text-slate-500 group-focus-within:text-amber-500 transition-colors">$</span>
                     <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" className="w-full bg-transparent border-b-2 border-white/10 py-4 pl-8 text-4xl font-mono text-white font-bold focus:border-amber-500 outline-none transition-all placeholder:text-slate-800" disabled={step > 1} />
                 </div>
             </div>

             <div className="space-y-3 relative z-10">
                 <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-display">Payout Method</label>
                 <div className="grid grid-cols-1 gap-2">
                    {PAYOUT_METHODS.map(m => (
                        <button key={m.id} onClick={() => { if(step === 1) { setMethod(m.id as any); setIsAddingNew(false); } }} disabled={step > 1} className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 group text-left ${method === m.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : 'bg-black/40 border-white/10 text-slate-500 hover:text-white hover:border-white/30'} ${step > 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            {m.icon}<span className="text-[9px] font-black uppercase tracking-wider font-display">{m.label}</span>
                        </button>
                    ))}
                 </div>
             </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="w-full md:w-7/12 p-6 md:p-10 bg-transparent flex flex-col relative md:overflow-y-auto scrollbar-hide">
             <button onClick={onClose} className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center text-slate-600 hover:text-white transition-colors z-20"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>

             {step === 4 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-[fadeIn_0.5s_ease-out] min-h-[300px]">
                    <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/30 shadow-[0_0_40px_rgba(245,158,11,0.2)]"><svg className="text-amber-500 w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg></div>
                    <h3 className="text-2xl font-black text-white mb-2 font-display uppercase tracking-tight">Withdrawal Initiated</h3>
                    <p className="text-slate-400 text-sm mb-8 font-medium">Funds are being transferred. Check your ledger for TX-ID.</p>
                </div>
             ) : step === 3 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="relative mb-10"><div className="w-20 h-20 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div><div className="absolute inset-0 flex items-center justify-center"><div className="w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_#F59E0B]"></div></div></div>
                    <h3 className="text-lg font-black text-white mb-2 animate-pulse font-display uppercase tracking-widest">Releasing Liquidity</h3>
                </div>
             ) : step === 2 ? (
                <div className="flex-1 flex flex-col animate-[fadeIn_0.3s_ease-out]">
                    <div className="flex items-center mb-6 relative">
                        <button onClick={() => setStep(1)} className="absolute left-0 text-slate-500 hover:text-white transition-colors p-1">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                        </button>
                        <h3 className="text-white font-bold font-display uppercase tracking-widest text-sm text-center w-full">Security & Confirmation</h3>
                    </div>
                    
                    {/* Transaction Summary Card */}
                    <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-16 bg-amber-500/5 blur-[40px] rounded-full group-hover:bg-amber-500/10 transition-colors"></div>
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 relative z-10">Transaction Summary</h4>
                        <div className="space-y-3 relative z-10">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Amount</span>
                                <span className="text-white font-mono font-bold text-sm">${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Processing Fee</span>
                                <span className="text-rose-400 font-mono text-sm">-${fee.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between items-center text-xs pt-3 border-t border-white/5">
                                <span className="text-emerald-500 font-black uppercase tracking-wider">Net Payout</span>
                                <span className="text-emerald-400 font-mono font-bold text-base">${netAmount.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                             <div className="flex justify-between items-center text-xs pt-2">
                                <span className="text-slate-500 font-bold uppercase tracking-wider">Destination</span>
                                <span className="text-white text-[10px] font-mono uppercase truncate max-w-[200px] bg-black/40 px-2 py-1 rounded border border-white/10">{getDestinationLabel()}</span>
                            </div>
                            {note && (
                                <div className="flex justify-between items-center text-xs pt-2">
                                    <span className="text-slate-500 font-bold uppercase tracking-wider">Reference</span>
                                    <span className="text-white text-[10px] font-mono uppercase truncate max-w-[200px]">{note}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center">
                         <div className="mb-6 text-center">
                             <h3 className="text-xs font-black text-amber-500 mb-2 font-display uppercase tracking-widest flex items-center justify-center gap-2">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                Security Verification
                             </h3>
                             <p className="text-slate-400 text-[10px] max-w-xs mx-auto">Enter your 4-digit PIN to digitally sign and release funds.</p>
                        </div>
                        <div className="flex gap-4 mb-8">
                            {[0, 1, 2, 3].map((i) => (<input key={i} id={`pin-${i}`} type="password" value={pin[i]} onChange={(e) => handlePinChange(i, e.target.value)} onKeyDown={(e) => handlePinKeyDown(i, e)} onPaste={handlePinPaste} className="w-14 h-16 bg-black border border-white/20 rounded-xl text-center text-2xl font-mono text-white focus:border-amber-500 focus:ring-0 outline-none transition-all shadow-inner" maxLength={1} />))}
                        </div>
                    </div>

                    <button onClick={handlePinSubmit} disabled={status === 'verifying'} className="w-full py-4 bg-amber-500 text-black font-black uppercase tracking-[0.2em] text-xs rounded-xl hover:bg-white transition-all shadow-lg hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] font-display flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed">
                        {status === 'verifying' ? 'Verifying...' : 'Confirm Withdrawal'}
                        {status !== 'verifying' && <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
                    </button>
                    {error && <div className="mt-4 text-center text-red-500 text-xs font-bold animate-pulse bg-red-500/10 p-2 rounded-lg border border-red-500/20">{error}</div>}
                </div>
             ) : (
                <div className="flex-1 flex flex-col h-full max-h-[60vh] md:max-h-none">
                    <div className="mb-6"><h3 className="text-white font-bold font-display uppercase tracking-widest text-sm mb-2">Destination Details</h3><p className="text-slate-500 text-xs">Select payout method and verify details.</p></div>
                    <div className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
                        {/* Saved Destinations / Add New Logic */}
                        {!isAddingNew ? (
                            <div className="space-y-4">
                                {method === 'wire' && savedWires.map(w => (
                                    <div key={w.id} onClick={() => setSelectedWireId(w.id)} className={`bg-black border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedWireId === w.id ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 hover:border-white/30'}`}>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-600 text-white font-black text-xs">B</div><div><div className="text-white font-bold text-sm">{w.name}</div><div className="text-slate-500 text-xs font-mono">{w.number}</div></div></div>
                                        {selectedWireId === w.id && <div className="w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_#F59E0B]"></div>}
                                    </div>
                                ))}
                                {method === 'crypto' && savedWallets.map(w => (
                                    <div key={w.id} onClick={() => setSelectedWalletId(w.id)} className={`bg-black border rounded-xl p-4 flex items-center justify-between cursor-pointer transition-colors ${selectedWalletId === w.id ? 'border-amber-500 bg-amber-500/5' : 'border-white/10 hover:border-white/30'}`}>
                                        <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-lg flex items-center justify-center bg-purple-600 text-white font-black text-xs">C</div><div><div className="text-white font-bold text-sm">{w.label}</div><div className="text-slate-500 text-xs font-mono">{w.address}</div></div></div>
                                        {selectedWalletId === w.id && <div className="w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_8px_#F59E0B]"></div>}
                                    </div>
                                ))}
                                <button onClick={() => setIsAddingNew(true)} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-xs font-bold text-slate-500 hover:text-white hover:border-white/40 uppercase tracking-widest font-display">Add New Destination</button>
                                
                                <div className="pt-4 border-t border-white/10">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest font-display mb-2 block">Transfer Reference (Optional)</label>
                                    <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Invoice #1234" className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-xs outline-none focus:border-amber-500 transition-all placeholder:text-slate-700" />
                                </div>
                            </div>
                        ) : (
                            <div className="bg-black/40 border border-white/10 rounded-xl p-4 space-y-3 animate-[fadeIn_0.2s]">
                                <h4 className="text-white text-xs font-bold uppercase mb-2">New {method === 'wire' ? 'Bank Account' : 'Crypto Wallet'}</h4>
                                {method === 'wire' ? (
                                    <>
                                        <input className="w-full bg-black border border-white/10 rounded p-2 text-white text-xs" placeholder="Bank Name" value={newBankDetails.bankName} onChange={e => setNewBankDetails({...newBankDetails, bankName: e.target.value})} />
                                        <input className="w-full bg-black border border-white/10 rounded p-2 text-white text-xs" placeholder="Account Name" value={newBankDetails.accountName} onChange={e => setNewBankDetails({...newBankDetails, accountName: e.target.value})} />
                                        <input className="w-full bg-black border border-white/10 rounded p-2 text-white text-xs" placeholder="Account Number / IBAN" value={newBankDetails.accountNumber} onChange={e => setNewBankDetails({...newBankDetails, accountNumber: e.target.value})} />
                                    </>
                                ) : (
                                    <>
                                        <input className="w-full bg-black border border-white/10 rounded p-2 text-white text-xs" placeholder="Wallet Label (e.g. Ledger)" value={newWalletDetails.label} onChange={e => setNewWalletDetails({...newWalletDetails, label: e.target.value})} />
                                        <input className="w-full bg-black border border-white/10 rounded p-2 text-white text-xs font-mono" placeholder="Wallet Address" value={newWalletDetails.address} onChange={e => setNewWalletDetails({...newWalletDetails, address: e.target.value})} />
                                    </>
                                )}
                                <div className="flex gap-2 pt-2">
                                    <button onClick={handleSaveDestination} className="flex-1 bg-amber-500 text-black py-2 rounded text-xs font-bold hover:bg-white transition-colors">Save</button>
                                    <button onClick={() => setIsAddingNew(false)} className="flex-1 bg-white/10 text-white py-2 rounded text-xs font-bold hover:bg-white/20 transition-colors">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                    {error && <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-400 font-bold text-center animate-[shake_0.4s_ease-in-out]">{error}</div>}
                    <button onClick={handleInitiate} className="w-full mt-6 py-4 bg-white hover:bg-amber-500 text-black font-black text-sm uppercase tracking-[0.2em] rounded-xl shadow-lg transition-all hover:scale-[1.02] font-display">Review Withdrawal</button>
                </div>
             )}
        </div>
      </div>
    </div>
  );
};

export default WithdrawalModal;