
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { AppState } from '../types';

interface FooterProps {
  onNavigate: (page: 'privacy' | 'terms') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} ProHeadshot AI. All rights reserved.
        </p>
        <div className="flex gap-6">
          <button 
            onClick={() => onNavigate('privacy')}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {t('privacyPolicy')}
          </button>
          <button 
            onClick={() => onNavigate('terms')}
            className="text-slate-400 hover:text-white text-sm transition-colors"
          >
            {t('termsConditions')}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
