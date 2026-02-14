
import React from 'react';
import { X, Check, Star, Zap, Shield, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn overflow-hidden flex flex-col max-h-[90vh]">
        {/* Decorative background effects */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-indigo-900/50 to-transparent pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center text-center relative z-0 overflow-y-auto">
          <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-6 transform rotate-3">
             <Star className="w-8 h-8 text-white fill-white" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('unlockPro')}</h2>
          <p className="text-slate-400 text-sm sm:text-base mb-8">{t('oneTimePayment')}</p>

          <div className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-5 mb-8">
             <ul className="space-y-4 text-left">
                <li className="flex items-start gap-3">
                   <div className="bg-indigo-500/20 p-1 rounded-full text-indigo-400 mt-0.5">
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                   </div>
                   <span className="text-slate-200 text-sm sm:text-base">{t('featureWatermark')}</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="bg-indigo-500/20 p-1 rounded-full text-indigo-400 mt-0.5">
                      <Zap className="w-3.5 h-3.5" strokeWidth={3} />
                   </div>
                   <span className="text-slate-200 text-sm sm:text-base">{t('featureRes')}</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="bg-indigo-500/20 p-1 rounded-full text-indigo-400 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5" strokeWidth={3} />
                   </div>
                   <span className="text-slate-200 text-sm sm:text-base">{t('featureUnlimited')}</span>
                </li>
                <li className="flex items-start gap-3">
                   <div className="bg-indigo-500/20 p-1 rounded-full text-indigo-400 mt-0.5">
                      <Shield className="w-3.5 h-3.5" strokeWidth={3} />
                   </div>
                   <span className="text-slate-200 text-sm sm:text-base">{t('featureSupport')}</span>
                </li>
             </ul>
          </div>

          <Button 
            onClick={onUpgrade} 
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/25 py-4 text-lg font-bold"
          >
             {t('buyNow')}
          </Button>

          <p className="text-xs text-slate-500 mt-4">
             Secure payment powered by Stripe. 100% Money-back guarantee.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
