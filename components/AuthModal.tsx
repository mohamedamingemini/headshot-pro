
import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { auth, googleProvider, facebookProvider, appleProvider } from '../services/firebase';
import { signInWithPopup, AuthProvider } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const handleLogin = async (provider: AuthProvider) => {
    if (!auth) {
      setError(t('errorAuthNotConfigured'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/account-exists-with-different-credential') {
        setError(t('errorAccountExists'));
      } else if (err.code === 'auth/popup-closed-by-user') {
        // Ignore
      } else {
        setError(t('errorLoginFailed'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-800 border border-slate-700 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">{t('loginTitle')}</h2>
          <p className="text-slate-400 text-sm">{t('loginSubtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-200 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => handleLogin(googleProvider)}
            disabled={isLoading}
            className="w-full bg-white text-slate-900 hover:bg-slate-100 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {t('continueWithGoogle')}
          </button>

          <button
            onClick={() => handleLogin(facebookProvider)}
            disabled={isLoading}
            className="w-full bg-[#1877F2] text-white hover:bg-[#166fe5] font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            {t('continueWithFacebook')}
          </button>
          
          <button
            onClick={() => handleLogin(appleProvider)}
            disabled={isLoading}
            className="w-full bg-black text-white hover:bg-slate-900 font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-700"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
               <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.56-2.19-.6-3.28.01-.99.56-2.05.51-3.08-.34-1.63-1.37-2.68-4.22-1.07-7.07 1.58-2.79 4.88-2.77 6.36-.29.47.8 1.15.78 1.63 0 1.6-2.62 4.97-2.43 6.46-.14.65.98 1.05 1.51.52 2.37-1.16 1.88-2.83 4.28-4.46 5.11zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            {t('continueWithApple')}
          </button>
        </div>
        
        <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
               {t('loginDisclaimer')}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
