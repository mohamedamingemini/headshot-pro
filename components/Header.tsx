
import React, { useState } from 'react';
import { Camera, RefreshCw, Languages, LogIn, User as UserIcon, LogOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  onReset: () => void;
  canReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, canReset }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button 
              onClick={onReset}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              disabled={!canReset}
            >
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 hidden sm:block">
                {t('appName')}
              </h1>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 sm:hidden">
                ProHeadshot
              </h1>
            </button>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                  onClick={toggleLanguage}
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50"
              >
                  <Languages className="w-4 h-4" />
                  <span>{language === 'en' ? 'العربية' : 'English'}</span>
              </button>

              {canReset && (
                <button 
                  onClick={onReset}
                  className="hidden sm:flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>{t('startOver')}</span>
                </button>
              )}

              <div className="relative">
                {user ? (
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="w-7 h-7 rounded-full" />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                        {user.email?.[0].toUpperCase() || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-200 hidden sm:block max-w-[100px] truncate">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="flex items-center gap-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-1.5 rounded-lg transition-colors shadow-sm"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('login')}</span>
                  </button>
                )}

                {showUserMenu && user && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-20 overflow-hidden animate-fadeIn">
                      <div className="px-4 py-3 border-b border-slate-700">
                        <p className="text-xs text-slate-400">{t('profile')}</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-slate-700/50 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t('logout')}
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
};

export default Header;
