import React, { useState } from 'react';
import { User, TradingSettings } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface SettingsPanelProps {
  userProfile?: User;
  settings: TradingSettings;
  onUpdateSettings: (settings: TradingSettings) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ userProfile, settings, onUpdateSettings }) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'trading' | 'notifications'>('profile');
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean, title: string, message: string, type: 'danger' | 'warning' | 'info', onConfirm: () => void }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {}
  });

  const handleSettingChange = (key: keyof TradingSettings, value: any) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleNotificationChange = (key: keyof TradingSettings['notifications'], value: boolean) => {
    onUpdateSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: value }
    });
  };

  return (
    <div className="animate-[fadeIn_0.3s] space-y-6">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-prime-cyan/5 blur-[80px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-800 to-black border border-white/20 flex items-center justify-center shadow-2xl relative group">
            <span className="text-3xl font-black text-white">{userProfile?.name?.charAt(0) || 'U'}</span>
            <div className="absolute inset-0 bg-black/50 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer backdrop-blur-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">{userProfile?.name || 'Automated Bot'}</h2>
            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
              <span className="text-slate-400 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                {userProfile?.email || 'user@teslaprime.ai'}
              </span>
              <span className="text-prime-cyan flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                ID: {userProfile?.id || 'USR-XXXX'}
              </span>
              <span className={`flex items-center gap-1 ${userProfile?.kyc === 'verified' ? 'text-emerald-400' : 'text-amber-400'}`}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                KYC: {userProfile?.kyc?.toUpperCase() || 'PENDING'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-2">
          {[
            { id: 'profile', label: 'Automated Bot', icon: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></> },
            { id: 'security', label: 'Security & Access', icon: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></> },
            { id: 'trading', label: 'Trading Parameters', icon: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/> },
            { id: 'notifications', label: 'Alert Protocols', icon: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 text-left group ${
                activeTab === tab.id 
                ? 'bg-prime-cyan text-black shadow-[0_0_20px_rgba(0,240,255,0.2)] scale-100' 
                : 'bg-black/40 border border-white/5 text-slate-400 hover:text-white hover:border-white/20 scale-95 hover:scale-100'
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {tab.icon}
              </svg>
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl min-h-[500px]">
            
            {/* Automated Bot Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-8 animate-[fadeIn_0.3s]">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4">Automated Bot Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Bot Name</label>
                    <input type="text" defaultValue={userProfile?.name} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-prime-cyan outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Bot ID</label>
                    <input type="email" defaultValue={userProfile?.email} disabled className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">API Key</label>
                    <input type="tel" defaultValue={userProfile?.phoneNumber} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-prime-cyan outline-none transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Server Region</label>
                    <input type="text" defaultValue={userProfile?.country} className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-prime-cyan outline-none transition-all" />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-end">
                  <button className="px-6 py-3 bg-prime-cyan text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]">Save Changes</button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-[fadeIn_0.3s]">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4">Security Protocols</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-black/60 border border-white/10 rounded-2xl">
                    <div>
                      <div className="text-sm font-bold text-white mb-1">Two-Factor Authentication (2FA)</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Secure your account with an authenticator app</div>
                    </div>
                    <button 
                        onClick={() => setConfirmModal({
                            isOpen: true,
                            title: 'Enable 2FA',
                            message: 'Are you sure you want to enable Two-Factor Authentication? You will need an authenticator app like Google Authenticator.',
                            type: 'info',
                            onConfirm: () => console.log('2FA Enabled')
                        })}
                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
                    >
                        Enable
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/60 border border-white/10 rounded-2xl">
                    <div>
                      <div className="text-sm font-bold text-white mb-1">Change Password</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Last changed 30 days ago</div>
                    </div>
                    <button 
                        onClick={() => setConfirmModal({
                            isOpen: true,
                            title: 'Change Password',
                            message: 'You will receive an email with instructions to reset your password. Do you want to proceed?',
                            type: 'warning',
                            onConfirm: () => console.log('Password Reset Requested')
                        })}
                        className="px-4 py-2 bg-white/5 text-white border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        Update
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-black/60 border border-white/10 rounded-2xl">
                    <div>
                      <div className="text-sm font-bold text-white mb-1">Active Sessions</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Manage devices logged into your account</div>
                    </div>
                    <button 
                        onClick={() => setConfirmModal({
                            isOpen: true,
                            title: 'Revoke All Sessions',
                            message: 'This will log you out of all other devices immediately. Are you sure?',
                            type: 'danger',
                            onConfirm: () => console.log('Sessions Revoked')
                        })}
                        className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                    >
                        Revoke All
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Trading Tab */}
            {activeTab === 'trading' && (
              <div className="space-y-8 animate-[fadeIn_0.3s]">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4">Algorithmic Parameters</h3>
                
                <div className="space-y-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Tolerance Level</label>
                    <div className="grid grid-cols-3 gap-4">
                      {['conservative', 'balanced', 'aggressive'].map((level) => (
                        <button
                          key={level}
                          onClick={() => handleSettingChange('riskLevel', level)}
                          className={`p-4 rounded-xl border transition-all flex flex-col items-center justify-center gap-2 ${
                            settings.riskLevel === level
                            ? 'bg-prime-cyan/10 border-prime-cyan text-prime-cyan shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                            : 'bg-black/60 border-white/10 text-slate-500 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <span className="text-[10px] font-black uppercase tracking-widest">{level}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Maximum Trade Size (USDT)</label>
                      <span className="text-prime-cyan font-mono font-bold">${settings.maxTradeSize.toLocaleString()}</span>
                    </div>
                    <input 
                      type="range" 
                      min="100" 
                      max="10000" 
                      step="100"
                      value={settings.maxTradeSize}
                      onChange={(e) => handleSettingChange('maxTradeSize', parseInt(e.target.value))}
                      className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-prime-cyan"
                    />
                    <div className="flex justify-between text-[9px] text-slate-600 font-mono">
                      <span>$100</span>
                      <span>$10,000</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-8 animate-[fadeIn_0.3s]">
                <h3 className="text-white font-black uppercase tracking-widest text-xs border-b border-white/10 pb-4">Alert Protocols</h3>
                
                <div className="space-y-4">
                  {[
                    { key: 'tradeExecutions', label: 'Trade Executions', desc: 'Real-time alerts when algorithms open or close positions' },
                    { key: 'dailySummary', label: 'Daily Performance Summary', desc: 'End-of-day report on P/L and portfolio metrics' },
                    { key: 'marketNews', label: 'Market Intelligence', desc: 'High-impact news and volatility alerts' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-black/60 border border-white/10 rounded-2xl cursor-pointer hover:border-white/20 transition-all" onClick={() => handleNotificationChange(item.key as keyof TradingSettings['notifications'], !settings.notifications[item.key as keyof TradingSettings['notifications']])}>
                      <div>
                        <div className="text-sm font-bold text-white mb-1">{item.label}</div>
                        <div className="text-[10px] text-slate-500 uppercase tracking-widest">{item.desc}</div>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out ${settings.notifications[item.key as keyof TradingSettings['notifications']] ? 'bg-prime-cyan' : 'bg-white/10'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${settings.notifications[item.key as keyof TradingSettings['notifications']] ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
      
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
