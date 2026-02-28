
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  onNavigate: (page: 'privacy' | 'terms' | 'contact' | 'about' | 'blog-list' | 'admin' | 'portfolio-view') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
  
  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900/80 backdrop-blur-sm pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          
          {/* Brand Column */}
          <div className="col-span-1">
             <h3 className="text-lg font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400 w-fit">
               ProHeadshot AI
             </h3>
             <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
                Transform your professional image instantly with AI. Studio quality results without the studio.
             </p>
          </div>

          {/* Links Column */}
          <div className="col-span-1">
             <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider text-opacity-80">Company</h3>
             <ul className="space-y-3">
               <li>
                  <button onClick={() => onNavigate('portfolio-view')} className="text-slate-400 hover:text-white text-sm transition-colors">Portfolio</button>
               </li>
               <li>
                  <button onClick={() => onNavigate('blog-list')} className="text-slate-400 hover:text-white text-sm transition-colors">{t('blogTitle')}</button>
               </li>
               <li>
                  <button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-white text-sm transition-colors">{t('aboutUs')}</button>
               </li>
               <li>
                  <button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-white text-sm transition-colors">{t('contactUs')}</button>
               </li>
               <li>
                  <button onClick={() => onNavigate('privacy')} className="text-slate-400 hover:text-white text-sm transition-colors">{t('privacyPolicy')}</button>
               </li>
               <li>
                  <button onClick={() => onNavigate('terms')} className="text-slate-400 hover:text-white text-sm transition-colors">{t('termsConditions')}</button>
               </li>
             </ul>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p 
            className="text-slate-500 text-sm select-none cursor-default"
            onDoubleClick={() => onNavigate('admin')}
            title="© ProHeadshot AI"
          >
            © {new Date().getFullYear()} ProHeadshot AI. All rights reserved.
          </p>
          <div className="flex gap-4">
             {/* Social icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
