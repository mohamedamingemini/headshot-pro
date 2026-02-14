
import React, { useEffect, useState } from 'react';
import { Camera, RefreshCw, Languages, Zap, Plus, BookOpen } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getUsageStats } from '../services/usageService';

interface HeaderProps {
  onReset: () => void;
  canReset: boolean;
  refreshKey?: number; // Prop to force re-render when usage changes
  onOpenCredits: () => void;
  onNavigateBlog: () => void;
}

const Header: React.FC<HeaderProps> = ({ onReset, canReset, refreshKey, onOpenCredits, onNavigateBlog }) => {
  const { language, setLanguage, t } = useLanguage();
  const [credits, setCredits] = useState(3);

  useEffect(() => {
    const stats = getUsageStats();
    setCredits(stats.remaining);
  }, [refreshKey]); // Update when parent signals a change

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={onReset}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
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
            
            {/* Blog Link - Desktop */}
            <button 
              onClick={onNavigateBlog}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-slate-800 px-3 py-1.5 rounded-lg"
            >
               <BookOpen className="w-4 h-4" />
               <span className="hidden sm:inline">Blog</span>
            </button>

            {/* Credits Counter - Now Clickable */}
            <button 
              onClick={onOpenCredits}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 rounded-full border border-indigo-500/30 hover:border-indigo-500/60 text-xs font-medium text-indigo-300 shadow-lg shadow-indigo-900/20 transition-all cursor-pointer group"
            >
               <Zap className={`w-3.5 h-3.5 ${credits > 0 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
               <span>{t('creditsRemaining').replace('{amount}', credits.toString())}</span>
               <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center ml-1 group-hover:scale-110 transition-transform">
                 <Plus className="w-3 h-3" />
               </div>
            </button>

            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hidden md:flex"
            >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {canReset && (
              <button 
                onClick={onReset}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden lg:inline">{t('startOver')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
