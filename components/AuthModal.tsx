
import React, { useState } from 'react';
import { X, AlertCircle, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();

  if (!isOpen) return null;

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      setError(t('errorAuthNotConfigured'));
      return;
    }

    // Basic Validation
    if (!email || !password) return;
    
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError(t('errorPasswordMismatch'));
        return;
      }
      if (password.length < 6) {
        setError(t('errorWeakPassword'));
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError(t('errorAccountExists'));
      } else if (err.code === 'auth/invalid-email') {
        setError(t('errorInvalidEmail'));
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setError(t('errorLoginFailed'));
      } else {
        setError(isSignUp ? t('errorSignupFailed') : t('errorLoginFailed'));
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

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">
            {isSignUp ? t('signupTitle') : t('loginTitle')}
          </h2>
          <p className="text-slate-400 text-sm">
            {isSignUp ? t('signupSubtitle') : t('loginSubtitle')}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-800 rounded-lg flex items-center gap-2 text-red-200 text-sm animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
          <div className="space-y-1">
             <label className="text-xs font-medium text-slate-300 ml-1">{t('emailLabel')}</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-600 transition-all"
                />
             </div>
          </div>
          
          <div className="space-y-1">
             <label className="text-xs font-medium text-slate-300 ml-1">{t('passwordLabel')}</label>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('passwordPlaceholder')}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-600 transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                   {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
             </div>
          </div>

          {isSignUp && (
            <div className="space-y-1 animate-fadeIn">
               <label className="text-xs font-medium text-slate-300 ml-1">{t('confirmPasswordLabel')}</label>
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder={t('passwordPlaceholder')}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-600 transition-all"
                  />
               </div>
            </div>
          )}

          <Button 
            type="submit" 
            isLoading={isLoading} 
            className="w-full py-3"
            disabled={!email || !password || (isSignUp && !confirmPassword)}
          >
             {isSignUp ? t('signUp') : t('signIn')}
          </Button>
        </form>
        
        <div className="mt-6 text-center">
            <p className="text-sm text-slate-400">
               {isSignUp ? t('hasAccount') : t('noAccount')}
               <button 
                 onClick={toggleMode}
                 className="text-indigo-400 hover:text-indigo-300 font-medium ml-1.5 focus:outline-none"
               >
                 {isSignUp ? t('signIn') : t('signUp')}
               </button>
            </p>
            <p className="text-xs text-slate-500 mt-4">
               {t('loginDisclaimer')}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
