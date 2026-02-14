
import React from 'react';
import Button from './Button';
import { ArrowLeft, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactUsProps {
  onBack: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-300 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-white group">
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('back')}
      </Button>
      
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{t('contactTitle')}</h1>
        <p className="text-slate-400 mb-12 text-lg">{t('contactDesc')}</p>
        
        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 sm:p-12 shadow-xl">
           <div className="w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Mail className="w-8 h-8 text-indigo-400" />
           </div>
           
           <h3 className="text-white font-medium mb-2">{t('contactEmailLabel')}</h3>
           <a 
             href="mailto:mohamed.fbaky@gmail.com" 
             className="text-2xl sm:text-3xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors break-all"
           >
             mohamed.fbaky@gmail.com
           </a>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
