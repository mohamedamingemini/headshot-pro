
import React, { useEffect, useState } from 'react';
import { Camera, Languages, BookOpen, Heart, Sun, Moon } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onNavigateBlog: () => void;
  onNavigatePortfolio: () => void;
  onNavigateFavorites: () => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigateBlog, onNavigatePortfolio, onNavigateFavorites }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    // Check if user previously set light mode
    const savedTheme = localStorage.getItem('proheadshot_theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.add('light-mode');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.add('light-mode');
      localStorage.setItem('proheadshot_theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.remove('light-mode');
      localStorage.setItem('proheadshot_theme', 'dark');
      setIsDarkMode(true);
    }
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button 
            onClick={onNavigatePortfolio}
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
            
            {/* Theme Toggle */}
            <button 
              onClick={toggleTheme}
              className="p-2 text-slate-400 hover:text-white transition-colors bg-slate-800/50 rounded-lg border border-slate-700/50"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Favorites Link */}
            <button 
              onClick={onNavigateFavorites}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-slate-800 px-3 py-1.5 rounded-lg"
            >
               <Heart className="w-4 h-4" />
               <span className="hidden sm:inline">Favorites</span>
            </button>

            {/* Portfolio Link - Desktop */}
            <button 
              onClick={onNavigatePortfolio}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-slate-800 px-3 py-1.5 rounded-lg"
            >
               <BookOpen className="w-4 h-4" />
               <span className="hidden sm:inline">Portfolio</span>
            </button>

            {/* Blog Link - Desktop */}
            <button 
              onClick={onNavigateBlog}
              className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors hover:bg-slate-800 px-3 py-1.5 rounded-lg"
            >
               <BookOpen className="w-4 h-4" />
               <span className="hidden sm:inline">Blog</span>
            </button>

            <button
                onClick={toggleLanguage}
                className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 hidden md:flex"
            >
                <Languages className="w-4 h-4" />
                <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
