import React, { useState, useMemo, useEffect, useRef } from 'react';
import { User, Transaction, AppNotification } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onUpdateUser: (user: User) => void;
  onAdminAction: (userId: string, amount: number, type: 'profit' | 'loss' | 'adjustment', description: string) => void;
  onLoginAsUser: (user: User) => void;
  platformConfig: any;
  onUpdatePlatformConfig: (config: any) => void;
  transactions: Transaction[];
  addTransaction?: (tx: Transaction) => void;
  addUserNotification?: (title: string, message: string, type: AppNotification['type']) => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ 
  isOpen, onClose, users, onUpdateUser, onAdminAction, onLoginAsUser, platformConfig, onUpdatePlatformConfig, transactions, addTransaction, addUserNotification 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'funding' | 'config'>('overview');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Settlement Automation State
  const [isAutoSettlement, setIsAutoSettlement] = useState(false);

  const [fundingForm, setFundingForm] = useState({ amount: '', type: 'adjustment' as 'profit' | 'loss' | 'adjustment', desc: '' });
  const [localConfig, setLocalConfig] = useState(platformConfig);
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'danger' | 'warning' | 'info', onConfirm: () => void }>({
      isOpen: false,
      title: '',
      message: '',
      type: 'info',
      onConfirm: () => {}
  });

  useEffect(() => {
      setLocalConfig(platformConfig);
  }, [platformConfig]);
  
  // User Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [kycFilter, setKycFilter] = useState<'all' | 'verified' | 'pending'>('all');

  const INSTITUTIONAL_EMAIL = 'teslaprimeadmai@gmail.com';
  const INSTITUTIONAL_PASS = 'AutomatedBot1@';

  const stats = useMemo(() => ({
      totalAum: users.reduce((acc, u) => acc + u.balance, 0),
      activeUsers: users.length,
      pendingKyc: users.filter(u => u.kyc === 'pending').length,
      systemHealth: 98
  }), [users]);

  const pendingTransactions = useMemo(() => {
      return transactions.filter(t => t.status === 'pending');
  }, [transactions]);

  const filteredUsers = useMemo(() => {
      return users.filter(u => {
          const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               u.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               u.email.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
          const matchesKyc = kycFilter === 'all' || u.kyc === kycFilter;
          return matchesSearch && matchesStatus && matchesKyc;
      });
  }, [users, searchQuery, statusFilter, kycFilter]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase() === INSTITUTIONAL_EMAIL && password === INSTITUTIONAL_PASS) {
        setIsLoggedIn(true);
    }
  };

  const handleFunding = () => {
      if (!selectedUser) return;
      const amt = parseFloat(fundingForm.amount);
      if (isNaN(amt)) return;

      onAdminAction(selectedUser.id, amt, fundingForm.type, fundingForm.desc || 'Institutional Adjustment');
      
      const newTx: Transaction = {
          id: `ADM-${Date.now()}`,
          userId: selectedUser.id,
          type: 'adjustment',
          amount: amt,
          status: 'completed',
          date: new Date().toISOString(),
          note: fundingForm.desc
      };
      if (addTransaction) {
          addTransaction(newTx);
      }
      addUserNotification?.('Ledger Update', `Admin ${fundingForm.type} of $${Math.abs(amt).toLocaleString()} applied to your portfolio.`, 'system');
      
      setFundingForm({ amount: '', type: 'adjustment', desc: '' });
  };

  const handleUpdateKyc = (user: User, status: 'verified' | 'pending') => {
      onUpdateUser({ ...user, kyc: status });
  };

  const handleUpdateStatus = (user: User, status: 'active' | 'suspended') => {
      onUpdateUser({ ...user, status: status });
  };

  const handleConfigSave = () => {
      onUpdatePlatformConfig(localConfig);
      addUserNotification?.('Protocol Update', 'Global settlement parameters have been broadcast to all nodes.', 'system');
  };

  if (!isOpen) return null;

  if (!isLoggedIn) {
      return (
          <div className="fixed inset-0 z-[200] bg-black/98 flex items-center justify-center p-6 backdrop-blur-3xl">
              <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] w-full max-w-sm shadow-[0_0_100px_rgba(0,240,255,0.1)] ring-1 ring-white/5">
                  <form onSubmit={handleLogin} className="space-y-6">
                      <div className="text-center mb-8">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-xl"><svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7L12 12L22 7L12 2Z" /></svg></div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest font-display">Command Access</h2>
                        <p className="text-[9px] text-prime-cyan font-bold uppercase tracking-widest mt-2">Level 4 Clearance Required</p>
                      </div>
                      <input type="text" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:border-prime-cyan transition-all font-mono" placeholder="ADMIN_ID" />
                      <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-xs outline-none focus:border-prime-cyan transition-all font-mono" placeholder="SECRET_PASS" />
                      <button className="w-full py-4 bg-prime-cyan text-black font-black uppercase text-[10px] rounded-xl hover:scale-105 transition-all shadow-lg font-display">Authorize Session</button>
                  </form>
              </div>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-3xl text-slate-200 flex overflow-hidden font-sans selection:bg-prime-cyan selection:text-black">
        {/* Sidebar */}
        <aside 
            className={`${
                isSidebarCollapsed ? 'w-20' : 'w-72'
            } bg-black/40 backdrop-blur-xl border-r border-white/10 flex flex-col transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] relative z-50 shadow-2xl`}
        >
            {/* Toggle Button */}
            <button 
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="absolute -right-3 top-8 w-6 h-6 bg-prime-cyan text-black rounded-full flex items-center justify-center border-2 border-black z-50 hover:scale-110 hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className={`transition-transform duration-300 ${isSidebarCollapsed ? 'rotate-180' : 'rotate-0'}`}><path d="M15 18l-6-6 6-6" /></svg>
            </button>

            {/* Logo Area */}
            <div className={`h-24 flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'px-8'} border-b border-white/5 transition-all duration-300`}>
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                    <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7L12 12L22 7L12 2Z" /></svg>
                </div>
                <div className={`ml-4 overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
                    <div className="text-white font-black text-sm uppercase tracking-widest font-display whitespace-nowrap">Prime Core</div>
                    <div className="text-[9px] text-prime-cyan font-mono tracking-wider">SYSTEM V4.2</div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8 px-3 space-y-2 overflow-y-auto scrollbar-hide">
                {[
                    { id: 'overview', label: 'Central Command', icon: <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/> },
                    { id: 'funding', label: 'Liquidity Desk', icon: <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/> },
                    { id: 'users', label: 'Bot Matrix', icon: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></> },
                    { id: 'config', label: 'Protocol Config', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></> }
                ].map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => setActiveTab(t.id as any)} 
                        className={`w-full flex items-center p-3 rounded-xl transition-all duration-200 group relative overflow-visible ${
                            activeTab === t.id 
                            ? 'bg-prime-cyan text-black shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-100' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5 scale-95 hover:scale-100'
                        } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 relative z-10">{t.icon}</svg>
                        
                        <div className={`overflow-hidden transition-all duration-300 ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100 ml-4'}`}>
                            <span className="text-[10px] font-black uppercase tracking-[0.15em] whitespace-nowrap relative z-10">{t.label}</span>
                        </div>

                        {/* Tooltip for collapsed state */}
                        {isSidebarCollapsed && (
                            <div className="absolute left-full ml-4 px-3 py-2 bg-black border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[100] whitespace-nowrap shadow-2xl">
                                {t.label}
                            </div>
                        )}

                        {/* Hover glow effect for non-active items */}
                        {activeTab !== t.id && (
                             <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 rounded-xl"></div>
                        )}
                    </button>
                ))}
            </nav>

            {/* Footer / Logout */}
            <div className={`p-4 border-t border-white/5 ${isSidebarCollapsed ? 'flex justify-center' : ''}`}>
                <button 
                    onClick={() => { setIsLoggedIn(false); onClose(); }} 
                    className={`group flex items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 hover:bg-rose-500 hover:text-white text-rose-500 transition-all duration-300 ${isSidebarCollapsed ? 'w-10 h-10 p-0' : 'w-full py-4 gap-3'}`}
                    title="Terminate Session"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                    {!isSidebarCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Disconnect</span>}
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 relative overflow-hidden flex flex-col bg-transparent">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,#00F0FF08_0%,transparent_40%)] pointer-events-none"></div>
            
            <div className={`flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8 transition-all duration-300`}>
                <div className={`mx-auto h-full flex flex-col ${isSidebarCollapsed ? 'max-w-[2400px]' : 'max-w-[1920px]'}`}>
                    
                    {/* --- CENTRAL COMMAND (OVERVIEW) --- */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8 animate-[fadeIn_0.3s]">
                            {/* Header */}
                            <div className="flex justify-between items-end pb-8 border-b border-white/5">
                                <div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-display mb-2">Settlement Command</h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Gateway Status & Pending Clearances</p>
                                </div>
                                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${isAutoSettlement ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                    Core Node V4.2
                                </div>
                            </div>

                            {/* SETTLEMENT ENGINE CONTROL (PRIMARY) */}
                            <div className={`p-8 rounded-[2.5rem] border transition-all duration-500 relative overflow-hidden ${isAutoSettlement ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-amber-500/5 border-amber-500/20'}`}>
                                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-24 h-24 rounded-2xl flex items-center justify-center text-4xl shadow-2xl transition-all duration-500 ${isAutoSettlement ? 'bg-emerald-500 text-black shadow-emerald-500/20' : 'bg-amber-500 text-black shadow-amber-500/20'}`}>
                                            {isAutoSettlement ? (
                                                <svg className="w-10 h-10 animate-[spin_4s_linear_infinite]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                            ) : (
                                                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><rect x="11" y="11" width="2" height="6" rx="1"/><circle cx="12" cy="8" r="1"/></svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`text-2xl font-black uppercase tracking-tight font-display mb-2 ${isAutoSettlement ? 'text-emerald-400' : 'text-amber-500'}`}>
                                                {isAutoSettlement ? 'Neural Engine: ENGAGED' : 'Manual Protocol: ACTIVE'}
                                            </h3>
                                            <p className="text-slate-400 text-xs font-medium max-w-lg leading-relaxed">
                                                {isAutoSettlement 
                                                    ? 'Automated settlement logic is active. Inbound and outbound liquidity flows are processed by the V4.2 Core based on risk parameters.' 
                                                    : 'System is in SAFE MODE. Automated clearing processes are suspended. All liquidity events require Level 4 manual authorization.'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => setIsAutoSettlement(!isAutoSettlement)}
                                        className={`px-10 py-5 rounded-xl font-black uppercase text-xs tracking-[0.2em] transition-all shadow-xl hover:scale-105 ${
                                            isAutoSettlement 
                                            ? 'bg-[#020408] text-rose-500 border border-rose-500/50 hover:bg-rose-500 hover:text-white' 
                                            : 'bg-emerald-500 text-black border border-emerald-500 hover:bg-emerald-400'
                                        }`}
                                    >
                                        {isAutoSettlement ? 'Sever Uplink' : 'Initialize Auto-Pilot'}
                                    </button>
                                </div>
                            </div>

                            {/* LIQUIDITY QUEUE & STATS */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Queue Status */}
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-prime-cyan animate-pulse"></span>
                                            Settlement Queue
                                        </h4>
                                        <div className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">Live Feed</div>
                                    </div>
                                    
                                    <div className="space-y-3 flex-1">
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-prime-cyan/30 transition-all">
                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Inbound Deposits</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white font-mono font-black text-xl">{pendingTransactions.filter(t => t.type === 'deposit').length}</span>
                                                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-prime-cyan/30 transition-all">
                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Outbound Requests</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-white font-mono font-black text-xl">{pendingTransactions.filter(t => t.type === 'withdrawal').length}</span>
                                                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group hover:border-prime-cyan/30 transition-all">
                                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Risk Flags</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-rose-400 font-mono font-black text-xl">0</span>
                                                <div className="w-2 h-2 rounded-full bg-rose-500"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <button onClick={() => setActiveTab('funding')} className="w-full mt-6 py-4 bg-prime-cyan/10 hover:bg-prime-cyan text-prime-cyan hover:text-black font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-prime-cyan/20">
                                        Access Liquidity Desk
                                    </button>
                                </div>

                                {/* Active Gateways */}
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8">
                                    <h4 className="text-white font-black uppercase tracking-widest text-xs mb-6">Active Gateways</h4>
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                        {['SWIFT / SEPA', 'BTC (Native)', 'ERC-20 (ETH)', 'TRC-20 (USDT)'].map(p => (
                                            <div key={p} className="p-3 bg-black rounded-xl border border-white/10 flex items-center gap-3">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></div>
                                                <span className="text-[9px] font-bold text-slate-300 uppercase tracking-wider">{p}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl mb-6">
                                        <div className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1 flex items-center gap-2">
                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                                            System Diagnostics
                                        </div>
                                        <div className="text-slate-400 text-[10px] leading-relaxed">
                                            All settlement nodes operational. Average block confirmation time: 4.2s. Bank relay latency: 120ms.
                                        </div>
                                    </div>
                                    <button onClick={() => setActiveTab('config')} className="w-full py-4 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all border border-white/5">
                                        Configure Protocols
                                    </button>
                                </div>

                                {/* High Level Stats */}
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col justify-center relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-24 bg-prime-cyan/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-prime-cyan/10 transition-all duration-700"></div>
                                    <div className="relative z-10">
                                        <div className="mb-8">
                                            <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-3">Net Platform AUM</h4>
                                            <div className="text-4xl xl:text-5xl font-mono font-bold text-white tracking-tighter">${stats.totalAum.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                                            <div>
                                                <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Total Identities</h4>
                                                <div className="text-2xl font-mono font-bold text-prime-cyan">{stats.activeUsers}</div>
                                            </div>
                                            <div>
                                                <h4 className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] mb-2">Pending KYC</h4>
                                                <div className="text-2xl font-mono font-bold text-amber-500">{stats.pendingKyc}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- IDENTITY MATRIX --- */}
                    {activeTab === 'users' && (
                        <div className="animate-[fadeIn_0.3s] h-[calc(100vh-8rem)] flex flex-col">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-6 shrink-0">
                                <div>
                                    <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter font-display mb-2">Bot Matrix</h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Managing {filteredUsers.length} active entity records</p>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                                    <div className="relative flex-1 lg:w-96">
                                        <input 
                                            type="text" 
                                            placeholder="SEARCH_BY_NAME_ID_EMAIL..." 
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            className="w-full bg-black border border-white/10 rounded-xl px-12 py-4 text-white text-[10px] font-mono outline-none focus:border-prime-cyan transition-all shadow-lg focus:shadow-prime-cyan/10" 
                                        />
                                        <svg className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <select 
                                            value={statusFilter}
                                            onChange={e => setStatusFilter(e.target.value as any)}
                                            className="bg-black border border-white/10 rounded-xl px-6 py-4 text-slate-400 text-[9px] font-black uppercase tracking-widest outline-none focus:border-prime-cyan transition-all cursor-pointer hover:bg-white/5"
                                        >
                                            <option value="all">Status: ALL</option>
                                            <option value="active">ACTIVE</option>
                                            <option value="suspended">SUSPENDED</option>
                                        </select>
                                        <select 
                                            value={kycFilter}
                                            onChange={e => setKycFilter(e.target.value as any)}
                                            className="bg-black border border-white/10 rounded-xl px-6 py-4 text-slate-400 text-[9px] font-black uppercase tracking-widest outline-none focus:border-prime-cyan transition-all cursor-pointer hover:bg-white/5"
                                        >
                                            <option value="all">KYC: ALL</option>
                                            <option value="verified">VERIFIED</option>
                                            <option value="pending">PENDING</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-prime-cyan via-blue-500 to-purple-600 z-20"></div>
                                <div className="overflow-auto flex-1 scrollbar-hide">
                                    <table className="w-full text-left min-w-[1200px]">
                                        <thead className="bg-black/80 text-[9px] font-black text-slate-500 uppercase tracking-widest sticky top-0 z-10 backdrop-blur-xl border-b border-white/10">
                                            <tr>
                                                <th className="p-6">Bot ID</th>
                                                <th className="p-6">Capital Allocation</th>
                                                <th className="p-6">KYC Status</th>
                                                <th className="p-6">Account Status</th>
                                                <th className="p-6">Location</th>
                                                <th className="p-6">Join Date</th>
                                                <th className="p-6 text-right">Command Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={7} className="p-32 text-center">
                                                        <div className="text-slate-600 font-mono text-xs uppercase tracking-[0.2em] font-bold">NO RECORDS FOUND MATCHING CRITERIA</div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredUsers.map(u => (
                                                    <tr key={u.id} className="text-xs hover:bg-white/[0.03] transition-all group border-l-2 border-l-transparent hover:border-l-prime-cyan">
                                                        <td className="p-6">
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-black text-sm text-white border border-white/10 group-hover:bg-prime-cyan group-hover:text-black transition-all shadow-lg">{u.name[0]}</div>
                                                                <div>
                                                                    <div className="text-white font-bold uppercase tracking-tight text-sm">{u.name}</div>
                                                                    <div className="text-[9px] text-slate-500 font-mono mt-1 font-bold">{u.id}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-6 font-mono font-bold text-emerald-400 text-sm">
                                                            ${u.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                        <td className="p-6">
                                                            <div 
                                                                onClick={() => {
                                                                    setConfirmModal({
                                                                        isOpen: true,
                                                                        title: u.kyc === 'verified' ? 'Revoke KYC' : 'Verify KYC',
                                                                        message: `Are you sure you want to change KYC status for ${u.name} to ${u.kyc === 'verified' ? 'pending' : 'verified'}?`,
                                                                        type: u.kyc === 'verified' ? 'warning' : 'info',
                                                                        onConfirm: () => handleUpdateKyc(u, u.kyc === 'verified' ? 'pending' : 'verified')
                                                                    });
                                                                }}
                                                                className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer select-none hover:scale-105 active:scale-95 ${
                                                                    u.kyc === 'verified' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                                }`}
                                                            >
                                                                {u.kyc}
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div 
                                                                onClick={() => {
                                                                    setConfirmModal({
                                                                        isOpen: true,
                                                                        title: u.status === 'active' ? 'Suspend Entity' : 'Reactivate Entity',
                                                                        message: `Are you sure you want to ${u.status === 'active' ? 'suspend' : 'reactivate'} access for ${u.name}?`,
                                                                        type: u.status === 'active' ? 'danger' : 'info',
                                                                        onConfirm: () => handleUpdateStatus(u, u.status === 'active' ? 'suspended' : 'active')
                                                                    });
                                                                }}
                                                                className={`inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border transition-all cursor-pointer select-none hover:scale-105 active:scale-95 ${
                                                                    u.status === 'active' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                                                                }`}
                                                            >
                                                                {u.status}
                                                            </div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="text-white font-bold text-[10px] uppercase tracking-wider">{u.country || 'N/A'}</div>
                                                            <div className="text-[9px] text-slate-600 mt-1 uppercase font-bold tracking-wider">{u.phoneNumber || 'NO_PH_LINK'}</div>
                                                        </td>
                                                        <td className="p-6">
                                                            <div className="text-slate-400 font-mono text-[10px]">{u.joinDate}</div>
                                                            <div className="text-[8px] text-slate-600 uppercase mt-1 font-bold tracking-wider">{u.linkedAccounts} Linked Accts</div>
                                                        </td>
                                                        <td className="p-6 text-right space-x-3">
                                                            <button onClick={() => { setSelectedUser(u); setActiveTab('funding'); }} className="text-prime-cyan font-black uppercase text-[9px] tracking-widest hover:underline transition-all hover:text-white">Capitalize</button>
                                                            <button onClick={() => onLoginAsUser(u)} className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all shadow-md">Audit Session</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between items-center text-[10px] text-slate-600 font-mono sticky bottom-0 z-10 backdrop-blur-md">
                                    <div>RECORDS_START: 01 // RECORDS_END: {filteredUsers.length}</div>
                                    <div className="flex gap-4">
                                        <span className="text-prime-cyan/50 uppercase font-black">Link State: Stable</span>
                                        <span className="uppercase font-black">Node: PR-MATRIX-04</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- LIQUIDITY DESK --- */}
                    {activeTab === 'funding' && (
                        <div className="max-w-2xl mx-auto space-y-12 animate-[fadeIn_0.3s]">
                            <div className="text-center">
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-display mb-2">Liquidity Desk</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Manual Capital Injection & Ledger Adjustment</p>
                            </div>

                            {/* Pending Transactions Section */}
                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
                                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4 mb-6">Pending Transactions</h3>
                                <div className="space-y-4">
                                    {transactions.filter(t => t.status === 'pending').length === 0 ? (
                                        <div className="text-slate-500 text-xs font-mono text-center py-4">No pending transactions.</div>
                                    ) : (
                                        transactions.filter(t => t.status === 'pending').map(tx => {
                                            const user = users.find(u => u.id === tx.userId);
                                            return (
                                                <div key={tx.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl">
                                                    <div>
                                                        <div className="text-xs font-bold text-white uppercase">{tx.type} - ${tx.amount.toLocaleString()}</div>
                                                        <div className="text-[10px] text-slate-400 font-mono mt-1">
                                                            User: {user?.name || tx.userId} | Date: {new Date(tx.date).toLocaleString()}
                                                        </div>
                                                        {tx.destination && <div className="text-[10px] text-slate-400 font-mono">Dest: {tx.destination}</div>}
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                setConfirmModal({
                                                                    isOpen: true,
                                                                    title: 'Approve Transaction',
                                                                    message: `Are you sure you want to approve this ${tx.type} of $${tx.amount.toLocaleString()} for ${user?.name || tx.userId}?`,
                                                                    type: 'info',
                                                                    onConfirm: () => {
                                                                        if (addTransaction) {
                                                                            addTransaction({ ...tx, status: 'completed' });
                                                                        }
                                                                        if (tx.type === 'deposit' && user) {
                                                                            onUpdateUser({ ...user, balance: user.balance + tx.amount });
                                                                            addUserNotification?.('Deposit Approved', `Your deposit of $${tx.amount} has been credited.`, 'success');
                                                                        } else if (tx.type === 'withdrawal') {
                                                                            addUserNotification?.('Withdrawal Approved', `Your withdrawal of $${tx.amount} has been processed.`, 'success');
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded text-[10px] font-black uppercase hover:bg-emerald-500/30 transition-all"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => {
                                                                setConfirmModal({
                                                                    isOpen: true,
                                                                    title: 'Reject Transaction',
                                                                    message: `Are you sure you want to reject this ${tx.type} of $${tx.amount.toLocaleString()} for ${user?.name || tx.userId}?`,
                                                                    type: 'danger',
                                                                    onConfirm: () => {
                                                                        if (addTransaction) {
                                                                            addTransaction({ ...tx, status: 'failed' });
                                                                        }
                                                                        if (tx.type === 'withdrawal' && user) {
                                                                            onUpdateUser({ ...user, balance: user.balance + tx.amount });
                                                                            addUserNotification?.('Withdrawal Rejected', `Your withdrawal of $${tx.amount} was rejected. Funds returned.`, 'warning');
                                                                        } else if (tx.type === 'deposit') {
                                                                            addUserNotification?.('Deposit Rejected', `Your deposit of $${tx.amount} could not be verified.`, 'warning');
                                                                        }
                                                                    }
                                                                });
                                                            }}
                                                            className="px-3 py-1.5 bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded text-[10px] font-black uppercase hover:bg-rose-500/30 transition-all"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>
                            </div>

                            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-12 space-y-8 shadow-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-32 bg-prime-cyan/5 blur-[80px] rounded-full pointer-events-none"></div>
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Select Target Entity</label>
                                    <select 
                                        className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white font-mono text-sm outline-none focus:border-prime-cyan transition-all cursor-pointer hover:bg-white/5" 
                                        value={selectedUser?.id || ''} 
                                        onChange={e => setSelectedUser(users.find(u => u.id === e.target.value) || null)}
                                    >
                                        <option value="">CHOOSE_IDENTITY...</option>
                                        {users.map(u => <option key={u.id} value={u.id}>{u.name} — ${u.balance.toLocaleString()} (ID: {u.id})</option>)}
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'adjustment', label: 'Manual Adj', icon: <path d="M12 20v-6M9 17l3 3 3-3"/> },
                                        { id: 'profit', label: 'Neural Credit', icon: <path d="M12 4v6M15 7l-3-3-3 3"/> },
                                        { id: 'loss', label: 'System Debit', icon: <path d="M12 20v-6M9 17l3 3 3-3"/> }
                                    ].map(t => (
                                        <button 
                                            key={t.id} 
                                            onClick={() => setFundingForm({...fundingForm, type: t.id as any})} 
                                            className={`flex flex-col items-center justify-center p-6 rounded-2xl border transition-all gap-3 ${
                                                fundingForm.type === t.id ? 'bg-prime-cyan text-black border-prime-cyan shadow-[0_0_20px_rgba(0,240,255,0.4)]' : 'bg-black text-slate-500 border-white/10 hover:border-white/30 hover:bg-white/5'
                                            }`}
                                        >
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">{t.icon}</svg>
                                            <span className="text-[9px] font-black uppercase tracking-widest">{t.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Transaction Magnitude (USD)</label>
                                    <input 
                                        type="number" 
                                        value={fundingForm.amount} 
                                        onChange={e => setFundingForm({...fundingForm, amount: e.target.value})} 
                                        className="w-full bg-black border border-white/10 rounded-2xl p-6 text-white text-4xl font-mono text-center outline-none focus:border-prime-cyan transition-all placeholder:text-slate-800" 
                                        placeholder="0.00" 
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest ml-2">Audit Memo / Description</label>
                                    <input 
                                        type="text" 
                                        value={fundingForm.desc} 
                                        onChange={e => setFundingForm({...fundingForm, desc: e.target.value})} 
                                        className="w-full bg-black border border-white/10 rounded-2xl p-5 text-white text-xs outline-none focus:border-prime-cyan transition-all hover:bg-white/5" 
                                        placeholder="ENTER_SYSTEM_REASON..." 
                                    />
                                </div>

                                <button 
                                    onClick={handleFunding} 
                                    disabled={!selectedUser || !fundingForm.amount}
                                    className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:bg-prime-cyan transition-all disabled:opacity-50 shadow-xl font-display hover:scale-[1.02] active:scale-95"
                                >
                                    Authorize Transaction
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- PROTOCOL CONFIG --- */}
                    {activeTab === 'config' && (
                        <div className="max-w-4xl mx-auto space-y-12 animate-[fadeIn_0.3s]">
                            <div className="text-center">
                                <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter font-display mb-2">Protocol Configuration</h2>
                                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Global Settlement Parameters & Payment Instructions</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 border-b border-white/5 pb-4 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21v-7M19 21v-7M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v3H4zM12 3v3"/></svg>
                                        Institutional Banking (FIAT)
                                    </h3>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                                        These coordinates are displayed to clients during Wire/SWIFT deposits. Ensure accuracy to prevent settlement failures.
                                    </p>
                                    <div className="space-y-6">
                                        {Object.keys(localConfig).filter(k => k.includes('bank') || k.includes('account') || k.includes('swift')).map(key => (
                                            <div key={key} className="space-y-2 group">
                                                <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest ml-1 group-hover:text-prime-cyan transition-colors">{key.replace(/([A-Z])/g, ' $1')}</label>
                                                <input 
                                                    type="text" 
                                                    value={localConfig[key]} 
                                                    onChange={e => setLocalConfig({...localConfig, [key]: e.target.value})}
                                                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-[10px] font-mono outline-none focus:border-prime-cyan transition-all focus:bg-prime-cyan/5"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 space-y-6">
                                    <h3 className="text-white font-black uppercase tracking-widest text-xs mb-4 border-b border-white/5 pb-4 flex items-center gap-2">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/></svg>
                                        Crypto Settlement Nodes
                                    </h3>
                                    <p className="text-[10px] text-slate-500 leading-relaxed mb-4">
                                        Active wallet addresses for client deposits. Changing these will instantly update the client portal.
                                    </p>
                                    <div className="space-y-6">
                                        {Object.keys(localConfig).filter(k => k.includes('Address')).map(key => (
                                            <div key={key} className="space-y-2 group">
                                                <label className="text-[9px] text-slate-500 font-black uppercase tracking-widest ml-1 group-hover:text-prime-cyan transition-colors">{key.replace(/([A-Z])/g, ' $1')}</label>
                                                <input 
                                                    type="text" 
                                                    value={localConfig[key]} 
                                                    onChange={e => setLocalConfig({...localConfig, [key]: e.target.value})}
                                                    className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-[10px] font-mono outline-none focus:border-prime-cyan transition-all focus:bg-prime-cyan/5"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center pb-8">
                                <button 
                                    onClick={handleConfigSave}
                                    className="px-12 py-5 bg-prime-cyan text-black font-black uppercase text-xs tracking-[0.3em] rounded-2xl hover:scale-105 transition-all shadow-2xl font-display hover:shadow-[0_0_40px_rgba(0,240,255,0.4)]"
                                >
                                    Broadcast Configuration
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
        
        <ConfirmationModal 
            isOpen={confirmModal.isOpen}
            onClose={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
            onConfirm={confirmModal.onConfirm}
            title={confirmModal.title}
            message={confirmModal.message}
            type={confirmModal.type}
        />
    </div>
  );
};

export default AdminLogin;