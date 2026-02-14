
import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, X, PlayCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import AdSense from './AdSense';
import { AD_CONFIG } from '../constants';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: () => void;
}

const AD_DURATION = 30; // 30 seconds required viewing time

const RewardedAdModal: React.FC<RewardedAdModalProps> = ({ isOpen, onClose, onRewardGranted }) => {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState(AD_DURATION);
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state when opening
      setTimeLeft(AD_DURATION);
      setCanClaim(false);
    }
  }, [isOpen]);

  useEffect(() => {
    let interval: any;
    if (isOpen && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setCanClaim(true);
    }
    return () => clearInterval(interval);
  }, [isOpen, timeLeft]);

  const handleClaim = () => {
    if (!canClaim) return;
    onRewardGranted();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-indigo-400" />
            <h3 className="text-white font-bold text-lg">{t('watchAdForCredit')}</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Ad Container */}
        <div className="p-6 flex flex-col items-center justify-center bg-slate-950 min-h-[320px]">
           {/* 
              CRITICAL FOR VIDEO ADS:
              1. Fixed size container (300x250)
              2. responsive={false} to prevent AdSense from serving text banners
              3. format="rectangle" 
           */}
           <div className="w-[300px] h-[250px] bg-black border border-slate-800 flex items-center justify-center overflow-hidden rounded-lg shadow-lg relative">
              
              {/* Loading State / Video Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 z-0">
                 <div className="w-8 h-8 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin mb-2"></div>
                 <span className="text-xs uppercase tracking-wider font-semibold">Loading Ad...</span>
              </div>

              <div className="relative z-10 w-full h-full">
                <AdSense 
                  slot={AD_CONFIG.SLOTS.REWARD_MODAL} 
                  variant="card"
                  format="rectangle"
                  responsive={false}
                  style={{ display: 'block', width: '300px', height: '250px' }}
                />
              </div>
           </div>

           <p className="text-xs text-slate-500 mt-4 text-center uppercase tracking-widest">
             {t('advertisement')}
           </p>
        </div>

        {/* Footer / Action Area */}
        <div className="p-6 border-t border-slate-800 bg-slate-900 flex flex-col items-center gap-3">
          
          {!canClaim ? (
            <div className="flex items-center gap-2 text-slate-300 font-mono text-sm bg-slate-800 px-4 py-2 rounded-full border border-slate-700">
              <Clock className="w-4 h-4 animate-pulse text-indigo-400" />
              <span>{t('claimIn')} {timeLeft}s</span>
            </div>
          ) : (
            <div className="w-full animate-fadeIn flex flex-col gap-3">
               <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium mb-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{t('adRewardTitle')}</span>
               </div>
               <Button 
                  onClick={handleClaim} 
                  className="w-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/20"
                >
                  {t('claimReward')}
               </Button>
            </div>
          )}
          
          {!canClaim && (
            <p className="text-xs text-slate-500 text-center max-w-xs">
              {t('adRewardDesc')}
            </p>
          )}
        </div>
        
        {/* Progress Bar */}
        {!canClaim && (
          <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full">
            <div 
              className="h-full bg-indigo-500 transition-all duration-1000 ease-linear"
              style={{ width: `${((AD_DURATION - timeLeft) / AD_DURATION) * 100}%` }}
            />
          </div>
        )}

      </div>
    </div>
  );
};

export default RewardedAdModal;
