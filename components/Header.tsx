import React from 'react';
import { Camera, RefreshCw, Languages } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onReset: () => void;
  canReset: boolean;
}

const Header: React.FC<HeaderProps> = ({ onReset, canReset }) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 hidden sm:block">
              {t('appName')}
            </h1>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 sm:hidden">
              ProHeadshot
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
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
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">{t('startOver')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;