import React, { useState } from 'react';
import { Download, Layers, Palette, Undo, Redo, Share2, Check } from 'lucide-react';
import AdSense from './AdSense';
import { useLanguage } from '../contexts/LanguageContext';
import ChatInterface from './ChatInterface';
import { ChatMessage } from '../types';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  // Chat props
  chatMessages: ChatMessage[];
  onSendMessage: (text: string, successMessage?: string) => Promise<void>;
  isProcessing: boolean;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ 
  originalImage, 
  generatedImage,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  chatMessages,
  onSendMessage,
  isProcessing
}) => {
  const [blurAmount, setBlurAmount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('none');
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const { t } = useLanguage();

  const filterOptions = [
    { id: 'none', label: t('filterNormal') },
    { id: 'grayscale', label: t('filterGrayscale') },
    { id: 'sepia', label: t('filterSepia') },
    { id: 'invert', label: t('filterInvert') },
  ];

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `pro-headshot-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setShareMessage(null);

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'pro-headshot.jpg', { type: 'image/jpeg' });

      // Check if Web Share API is supported and can share files
      if (
        navigator.share && 
        navigator.canShare && 
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: t('appName'),
          text: 'Check out my new professional headshot created with AI!'
        });
      } else {
        // Fallback to Clipboard API
        if (typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([
            new ClipboardItem({
              [blob.type]: blob
            })
          ]);
          setShareMessage(t('copied'));
          setTimeout(() => setShareMessage(null), 2000);
        } else {
          throw new Error('Clipboard sharing not supported');
        }
      }
    } catch (error) {
      // Don't show error if user simply cancelled the share dialog
      if (error instanceof Error && error.name !== 'AbortError') {
        console.error('Error sharing:', error);
        setShareMessage(t('failed'));
        setTimeout(() => setShareMessage(null), 2000);
      }
    } finally {
      setIsSharing(false);
    }
  };

  const getFilterStyle = () => {
    let filterString = '';
    if (activeFilter !== 'none') {
      filterString += `${activeFilter}(100%)`;
    }
    return filterString.trim() || 'none';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-5xl mx-auto">
      {/* Original Image (Left Col Desktop, Bottom Col Mobile) */}
      <div className="flex flex-col gap-3 order-2 md:order-1">
        <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider hidden md:block">{t('original')}</h3>
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-inner">
          <img 
            src={originalImage} 
            alt="Original upload" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full md:hidden">
            {t('original')}
          </div>
        </div>

        {/* AdSense Component */}
        <div className="bg-slate-800/20 rounded-xl p-4 border border-slate-700/50 mt-4 flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold mb-2 w-full text-center border-b border-slate-700/30 pb-2">{t('advertisement')}</span>
          <div className="w-full flex justify-center min-h-[100px]">
            <AdSense slot="9876543210" className="!my-0 !w-full" format="rectangle" />
          </div>
        </div>
      </div>

      {/* Generated Result (Right Col Desktop, Top Col Mobile) */}
      <div className="flex flex-col gap-4 order-1 md:order-2">
        <div className="flex flex-wrap justify-between items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700/50 md:bg-transparent md:p-0 md:border-0 gap-y-2">
           <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider ml-2 rtl:mr-2 rtl:ml-0 md:ml-0 md:rtl:mr-0">{t('generatedResult')}</h3>
           
           <div className="flex items-center gap-1 sm:gap-2 ml-auto">
             <button 
               onClick={onUndo}
               disabled={!canUndo}
               className="p-2 sm:p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded-lg transition-all touch-manipulation"
               title="Undo last edit"
             >
               <Undo className="w-5 h-5 sm:w-4 sm:h-4 rtl:-scale-x-100" />
             </button>
             <button 
               onClick={onRedo}
               disabled={!canRedo}
               className="p-2 sm:p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded-lg transition-all touch-manipulation"
               title="Redo edit"
             >
               <Redo className="w-5 h-5 sm:w-4 sm:h-4 rtl:-scale-x-100" />
             </button>
             
             <div className="h-6 w-px bg-slate-700 mx-1" />
             
             <button 
               onClick={handleShare}
               disabled={isSharing}
               className="p-2 sm:p-0 sm:text-xs flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors sm:min-w-[70px] justify-center rounded-lg hover:bg-slate-800 sm:hover:bg-transparent touch-manipulation"
               title={t('share')}
             >
               {isSharing ? (
                 <span className="w-4 h-4 sm:w-3 sm:h-3 border-2 border-slate-400 border-t-white rounded-full animate-spin" />
               ) : shareMessage === t('copied') ? (
                 <Check className="w-5 h-5 sm:w-4 sm:h-4 text-green-400" />
               ) : (
                 <Share2 className="w-5 h-5 sm:w-4 sm:h-4" />
               )}
               <span className="hidden sm:inline">{shareMessage || t('share')}</span>
             </button>

             <div className="h-6 w-px bg-slate-700 mx-1" />

             <button 
               onClick={handleDownload}
               className="p-2 sm:p-0 sm:text-xs flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors rounded-lg hover:bg-slate-800 sm:hover:bg-transparent touch-manipulation"
               title={t('save')}
             >
               <Download className="w-5 h-5 sm:w-4 sm:h-4" /> 
               <span className="hidden sm:inline">{t('save')}</span>
             </button>
           </div>
        </div>
        
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-900 shadow-2xl ring-1 ring-white/10 group">
          {/* Base Image with Color Filters */}
          <img 
            src={generatedImage} 
            alt="Generated headshot" 
            className="w-full h-full object-cover relative z-0 transition-all duration-500"
            style={{ filter: getFilterStyle() }}
          />
          
          {/* Background Blur Overlay */}
          {blurAmount > 0 && (
            <div 
              className="absolute inset-0 z-10 pointer-events-none transition-all duration-300"
              style={{
                backdropFilter: `blur(${blurAmount}px)`,
                WebkitBackdropFilter: `blur(${blurAmount}px)`,
                maskImage: 'radial-gradient(circle at center, transparent 35%, black 100%)',
                WebkitMaskImage: 'radial-gradient(circle at center, transparent 35%, black 100%)'
              }}
            />
          )}

          <div className="absolute inset-0 pointer-events-none ring-inset ring-1 ring-white/10 rounded-2xl z-20"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Blur Control Slider */}
          <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700 flex flex-col justify-center">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-slate-200">{t('backgroundBlur')}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded border border-slate-700">{blurAmount.toFixed(1)}px</span>
            </div>
            
            <div className="relative h-6 flex items-center">
              <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={blurAmount}
                  onChange={(e) => setBlurAmount(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rtl:rotate-180"
                  style={{
                      background: `linear-gradient(to right, #6366f1 ${(blurAmount / 10) * 100}%, #334155 ${(blurAmount / 10) * 100}%)`
                  }}
              />
            </div>
          </div>

          {/* Color Filter Controls */}
          <div className="bg-slate-800/50 rounded-xl p-3 sm:p-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-slate-200">{t('colorFilters')}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id)}
                  className={`
                    px-2 py-2 rounded-lg text-xs font-medium transition-all border text-center touch-manipulation
                    ${activeFilter === option.id 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20' 
                      : 'bg-slate-700 text-slate-300 border-slate-600 hover:bg-slate-600 hover:border-slate-500'}
                  `}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Integrated Chat Interface (Below Edit Options) */}
        <div className="mt-2 border-t border-slate-800 pt-6">
           <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
             {t('aiEditor')}
             <span className="text-xs font-normal text-slate-400 px-2 py-0.5 bg-slate-800 rounded-full border border-slate-700">Gemini</span>
           </h3>
           <p className="text-slate-400 text-sm mb-4">{t('useEditor')}</p>
           <ChatInterface 
             messages={chatMessages}
             onSendMessage={onSendMessage}
             isProcessing={isProcessing}
             className="!mt-0 !h-[450px]"
           />
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;