
import React, { useState, useEffect } from 'react';
import { X, PlayCircle, Linkedin, Clock, Video } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import Button from './Button';
import { checkLinkedInEligibility } from '../services/usageService';

interface EarnCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchAd: () => void;
  onShareLinkedIn: () => Promise<void>;
  generatedImage?: string | null;
}

const EarnCreditsModal: React.FC<EarnCreditsModalProps> = ({ 
  isOpen, 
  onClose, 
  onWatchAd,
  onShareLinkedIn,
  generatedImage
}) => {
  const { t } = useLanguage();
  const [verifyLinkedIn, setVerifyLinkedIn] = useState(false);
  const [linkedInError, setLinkedInError] = useState<string | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
        setVerifyLinkedIn(false);
        setLinkedInError(null);
        
        // Check eligibility immediately on open to show correct state
        const eligibility = checkLinkedInEligibility();
        if (!eligibility.allowed) {
            setLinkedInError(t('alreadyShared') + ' ' + t('comeBackTomorrow').replace('{time}', eligibility.timeRemainingStr || '24h'));
        }
    }
  }, [isOpen, t]);

  if (!isOpen) return null;

  const initiateLinkedInShare = async () => {
      const eligibility = checkLinkedInEligibility();
      
      if (!eligibility.allowed) {
          setLinkedInError(t('alreadyShared') + ' ' + t('comeBackTomorrow').replace('{time}', eligibility.timeRemainingStr || '24h'));
          return;
      }

      setLinkedInError(null);
      
      // 1. Copy text to clipboard (Pre-defined thoughts)
      // We append the URL at the end of the clipboard text for convenience
      const textToShare = `${t('linkedInShareMessage')}\n\nhttps://proheadshot.ai`;
      try {
          await navigator.clipboard.writeText(textToShare);
      } catch (err) {
          console.error("Clipboard write failed", err);
      }

      // 2. Download Image if available (Auto-assist for sharing photo)
      if (generatedImage) {
          try {
             const link = document.createElement('a');
             link.href = generatedImage;
             link.download = `pro-headshot-linkedin-${Date.now()}.jpg`;
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
          } catch (e) {
             console.error("Failed to download image for share", e);
          }
      }

      // 3. Open LinkedIn
      let linkedinUrl = "";
      if (generatedImage) {
          // If they have an image, send them to the main feed to start a post with upload
          linkedinUrl = "https://www.linkedin.com/feed/";
      } else {
          // If just sharing the app link without a specific image generated yet
          const url = "https://proheadshot.ai";
          linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
      }
      
      const width = 600;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        linkedinUrl, 
        'linkedin_share', 
        `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`
      );

      // 4. Switch to verification UI
      setVerifyLinkedIn(true);
  };

  const confirmLinkedInShare = async () => {
      await onShareLinkedIn(); // This awards the credit
      onClose();
  };
  
  const handleWatchAdFallback = () => {
      onClose();
      onWatchAd();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn overflow-hidden">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">{t('earnCreditsTitle')}</h2>
            <p className="text-slate-400 text-sm">{t('earnCreditsDesc')}</p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          
          {verifyLinkedIn ? (
             /* Verification UI for LinkedIn */
             <div className="flex flex-col items-center text-center animate-fadeIn gap-4">
                 <div className="w-16 h-16 bg-[#0077b5]/20 rounded-full flex items-center justify-center text-[#0077b5] mb-2">
                    <Linkedin className="w-8 h-8" />
                 </div>
                 <h3 className="text-lg font-bold text-white">{t('verifyShareTitle')}</h3>
                 
                 <div className="bg-slate-800 p-3 rounded-lg border border-slate-700/50 w-full text-left">
                    <p className="text-sm text-slate-300 whitespace-pre-wrap">
                        {generatedImage ? t('verifyShareDescWithImage') : t('verifyShareDesc')}
                    </p>
                 </div>
                 
                 <div className="flex flex-col w-full gap-3 mt-2">
                     <Button onClick={confirmLinkedInShare} className="w-full bg-[#0077b5] hover:bg-[#006097]">
                         {t('confirmShare')}
                     </Button>
                     <Button variant="ghost" onClick={() => setVerifyLinkedIn(false)}>
                         {t('cancelShare')}
                     </Button>
                 </div>
             </div>
          ) : (
            /* Standard List */
            <div className="space-y-4">
            
            {/* Option 1: Watch Ad */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-indigo-500/50 transition-all cursor-pointer" onClick={() => { onClose(); onWatchAd(); }}>
                <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-full flex items-center justify-center text-indigo-400">
                    <PlayCircle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-white font-medium text-sm">{t('actionWatchAd')}</h3>
                    <p className="text-slate-500 text-xs">{t('actionWatchAdDesc')}</p>
                </div>
                </div>
                <Button size="sm" onClick={() => { onClose(); onWatchAd(); }} className="shrink-0 text-xs px-3 py-2 h-auto">
                {t('plusOne')}
                </Button>
            </div>

            {/* Option 2: LinkedIn Share (With Limit Logic) */}
            <div className={`bg-slate-800/50 border ${linkedInError ? 'border-slate-700 bg-slate-800/30' : 'border-slate-700 hover:border-indigo-500/50'} rounded-xl p-4 transition-all`}>
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#0077b5]/20 rounded-full flex items-center justify-center text-[#0077b5]">
                        <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-white font-medium text-sm">{t('actionLinkedIn')}</h3>
                        <p className="text-slate-500 text-xs">{t('actionLinkedInDesc')}</p>
                    </div>
                    </div>
                    <Button 
                        size="sm" 
                        onClick={initiateLinkedInShare} 
                        variant="secondary" 
                        className="shrink-0 text-xs px-3 py-2 h-auto bg-[#0077b5] hover:bg-[#006097]" 
                        disabled={!!linkedInError}
                    >
                         {t('plusThree')}
                    </Button>
                </div>
                
                {/* Fallback Area if Limit Reached */}
                {linkedInError && (
                    <div className="mt-3 bg-slate-900/50 rounded-lg p-3 flex flex-col sm:flex-row items-center justify-between gap-2 border border-slate-700/50">
                        <div className="text-xs text-red-300 flex items-center gap-1.5">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{linkedInError}</span>
                        </div>
                        <Button 
                           size="sm" 
                           onClick={handleWatchAdFallback}
                           variant="outline"
                           className="text-xs py-1 px-2 h-auto w-full sm:w-auto border-indigo-500/50 text-indigo-300 hover:bg-indigo-500/10 hover:text-indigo-200"
                        >
                            <Video className="w-3 h-3 mr-1" />
                            {t('watchAdInstead')}
                        </Button>
                    </div>
                )}
            </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EarnCreditsModal;
