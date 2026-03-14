
import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { auth, db } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreError';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onAdminAccess: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onAdminAccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [ssoStep, setSsoStep] = useState<'idle' | 'handshake' | 'authorized' | 'client_auth'>('idle');

  useEffect(() => {
    if (!isOpen) {
      setSsoStep('idle');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    setSsoStep('handshake');
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      
      setSsoStep('client_auth');
      
      // Check if user exists in Firestore
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      let userDocSnap;
      try {
        userDocSnap = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${firebaseUser.uid}`);
        return; // handleFirestoreError throws, but just in case
      }
      
      let userData: User;
      
      if (userDocSnap.exists()) {
        userData = userDocSnap.data() as User;
      } else {
        // Create new user
        userData = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Unknown User',
          email: firebaseUser.email || '',
          phoneNumber: firebaseUser.phoneNumber || '',
          country: 'Unknown',
          balance: 0,
          status: 'active',
          kyc: 'pending',
          linkedAccounts: 0,
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          activeBots: 0,
          autoTrading: false,
          notifications: [
            {
              id: 'welcome',
              title: 'Bot Verified',
              message: 'Welcome to Tesla Prime AI. Your secure terminal is initialized.',
              time: 'Just now',
              type: 'success',
              read: false
            }
          ]
        };
        try {
          await setDoc(userDocRef, userData);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${firebaseUser.uid}`);
          return;
        }
      }
      
      setSsoStep('authorized');
      
      setTimeout(() => {
        setIsLoading(false);
        // Check for admin
        if (firebaseUser.email === 'richie00709@gmail.com' && firebaseUser.emailVerified) {
            // We could also check a role field in Firestore here
            onAdminAccess();
        } else {
            onSuccess(userData);
        }
      }, 1000);
      
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message || 'Authentication failed');
      setIsLoading(false);
      setSsoStep('idle');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,240,255,0.1)] overflow-hidden flex flex-col animate-[scaleIn_0.3s_cubic-bezier(0.16,1,0.3,1)] ring-1 ring-white/5">
        <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-prime-cyan to-blue-600 animate-[pulse_4s_infinite]"></div>
        {ssoStep === 'idle' ? (
            <div className="p-8 md:p-10 relative">
                <div className="absolute top-4 right-4 flex gap-1">
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                    <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                </div>
                <div className="text-center mb-8">
                    <div className="relative w-14 h-14 mx-auto mb-4 group">
                        <div className="absolute inset-0 bg-prime-cyan blur-3xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <div className="relative w-full h-full bg-white rounded-2xl flex items-center justify-center shadow-2xl border border-white/50">
                            <svg className="w-6 h-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" />
                                <path d="M12 22L2 17L12 12L22 17L12 22Z" opacity="0.5" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter font-display">PRIME SSO</h2>
                    <p className="text-prime-cyan text-[8px] font-bold uppercase tracking-[0.3em] mt-1 text-shadow-glow">Institutional Access Gateway</p>
                </div>
                
                <div className="space-y-5">
                    {error && (
                        <div className="p-3 bg-rose-500/5 border border-rose-500/20 text-rose-500 text-[8px] font-black uppercase tracking-widest rounded-xl animate-shake flex items-center gap-2">
                            <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            {error}
                        </div>
                    )}
                    
                    <button 
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full py-4 bg-white text-black hover:bg-prime-cyan font-black uppercase tracking-[0.2em] text-[9px] rounded-xl transition-all shadow-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] flex items-center justify-center gap-3 mt-4 group hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-1 bg-black rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:0.1s]"></div>
                                <div className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:0.2s]"></div>
                            </div>
                        ) : (
                            <>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                                Authenticate with Google
                            </>
                        )}
                    </button>
                </div>
            </div>
        ) : (
            <div className="p-16 flex flex-col items-center justify-center text-center space-y-8 animate-[fadeIn_0.3s]">
                <div className="relative">
                    <div className={`absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-[spin_10s_linear_infinite] ${ssoStep === 'authorized' ? 'opacity-0' : 'opacity-100'}`}></div>
                    <div className={`w-28 h-28 rounded-full border-2 flex items-center justify-center transition-all duration-700 ${
                        ssoStep === 'authorized' 
                        ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.5)] scale-110' 
                        : ssoStep === 'client_auth'
                        ? 'bg-blue-600 border-blue-500 shadow-[0_0_60px_rgba(37,99,235,0.5)]'
                        : 'border-prime-cyan/50 bg-black shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                    }`}>
                        {ssoStep === 'authorized' ? (
                            <svg className="w-12 h-12 text-black animate-[scaleIn_0.3s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : ssoStep === 'client_auth' ? (
                            <svg className="w-12 h-12 text-white animate-[scaleIn_0.3s]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                        ) : (
                            <div className="flex flex-col gap-1 animate-pulse">
                                <div className="w-12 h-1 bg-prime-cyan rounded-full"></div>
                                <div className="w-8 h-1 bg-prime-cyan/50 rounded-full mx-auto"></div>
                            </div>
                        )}
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-widest mb-2 font-display">
                        {ssoStep === 'handshake' ? 'Performing Handshake' : ssoStep === 'authorized' ? 'Bot Verified' : 'Authenticating Client'}
                    </h3>
                    <p className="text-prime-cyan text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse font-mono">
                        {ssoStep === 'handshake' ? 'EXCHANGING KEYS...' : ssoStep === 'authorized' ? 'TOKEN GRANTED...' : 'DECRYPTING PROFILE...'}
                    </p>
                </div>
            </div>
        )}
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-700 hover:text-white transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

