
import React, { useState, useEffect } from 'react';
import { Download, Layers, Palette, Undo, Redo, Share2, Check, SplitSquareHorizontal, BookOpen, ArrowRight } from 'lucide-react';
import AdSense from './AdSense';
import { useLanguage } from '../contexts/LanguageContext';
import ChatInterface from './ChatInterface';
import CompareSlider from './CompareSlider';
import { ChatMessage, Article } from '../types';
import { AD_CONFIG } from '../constants';
import { getArticles } from '../services/articleService';

interface ResultDisplayProps {
  originalImage: string;
  generatedImage: string;
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  chatMessages: ChatMessage[];
  onSendMessage: (text: string, successMessage?: string) => Promise<void>;
  isProcessing: boolean;
  onSelectArticle?: (article: Article) => void;
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
  isProcessing,
  onSelectArticle
}) => {
  const [blurAmount, setBlurAmount] = useState(0);
  const [activeFilter, setActiveFilter] = useState('none');
  const [isSharing, setIsSharing] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [suggestedArticle, setSuggestedArticle] = useState<Article | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const loadSuggestion = async () => {
        try {
            const articles = await getArticles();
            if (articles.length > 0) {
                // Get a random article
                const random = articles[Math.floor(Math.random() * articles.length)];
                setSuggestedArticle(random);
            }
        } catch (e) {
            console.error("Failed to load article suggestion", e);
        }
    };
    loadSuggestion();
  }, []);

  const filterOptions = [
    { id: 'none', label: t('filterNormal') },
    { id: 'grayscale', label: t('filterGrayscale') },
    { id: 'sepia', label: t('filterSepia') },
    { id: 'invert', label: t('filterInvert') },
  ];

  const handleDownload = async () => {
    try {
      // Use Blob for download to handle large base64 strings efficiently
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pro-headshot-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Download failed, falling back to basic link", e);
      // Fallback
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `pro-headshot-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;
    setIsSharing(true);
    setShareMessage(null);

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const file = new File([blob], 'pro-headshot.jpg', { type: 'image/jpeg' });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: t('appName'),
          text: 'Check out my new professional headshot created with AI!'
        });
      } else {
        if (typeof ClipboardItem !== 'undefined') {
          await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
          setShareMessage(t('copied'));
          setTimeout(() => setShareMessage(null), 2000);
        } else {
          throw new Error('Clipboard sharing not supported');
        }
      }
    } catch (error) {
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
      {/* Sidebar (Original Image) */}
      <div className="flex flex-col gap-4 order-2 md:order-1 items-center md:items-stretch">
        
        {/* Header Spacer for alignment */}
        <div className="hidden md:flex items-center justify-between min-h-[44px]">
             <h3 className="text-slate-400 font-medium text-sm uppercase tracking-wider">{t('original')}</h3>
        </div>

        <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700 shadow-inner w-full">
          <img 
            src={originalImage} 
            alt="Original upload" 
            className="w-full h-full object-cover opacity-80"
            decoding="async"
          />
        </div>

        {/* Suggested Article (Moved Above Ad) - Sized 300x250 */}
        {suggestedArticle && onSelectArticle && (
            <div 
                onClick={() => onSelectArticle(suggestedArticle)}
                className="w-full max-w-[300px] h-[250px] mx-auto bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-indigo-500 cursor-pointer group transition-all shadow-lg relative flex flex-col"
            >
                {/* Image Section (~55%) */}
                <div className="h-[140px] w-full relative overflow-hidden shrink-0">
                    <img 
                        src={suggestedArticle.imageUrl} 
                        alt="" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute top-2 left-2 bg-indigo-600/90 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm z-10 backdrop-blur-sm border border-white/10">
                        {suggestedArticle.category === 'job' ? 'CAREER' : 'SUGGESTED'}
                    </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-4 flex flex-col justify-between bg-gradient-to-b from-slate-800 to-slate-900 border-t border-slate-700/50">
                     <div>
                        <h5 className="font-bold text-white text-sm leading-tight mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">
                            {suggestedArticle.title}
                        </h5>
                        <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {suggestedArticle.excerpt}
                        </p>
                     </div>
                     <div className="flex items-center text-[10px] text-indigo-400 font-bold uppercase tracking-wider mt-1 group-hover:translate-x-1 transition-transform">
                        Read Article <ArrowRight className="w-3 h-3 ml-1" />
                     </div>
                </div>
            </div>
        )}

        {/* AdSense Component - Aligned */}
        <div className="w-full max-w-[300px] mx-auto flex flex-col items-center">
             {/* AdSense wrapper ensuring centering */}
             <div className="w-full bg-slate-800/20 rounded-xl p-2 border border-slate-700/30 flex flex-col items-center justify-center min-h-[260px]">
                <span className="text-[9px] uppercase tracking-widest text-slate-600 font-semibold mb-2">{t('advertisement')}</span>
                <AdSense 
                    slot={AD_CONFIG.SLOTS.RESULT_SIDEBAR} 
                    className="!my-0 flex justify-center" 
                    format="rectangle" 
                    style={{ width: '300px', height: '250px', display: 'block' }}
                />
             </div>
        </div>

      </div>

      {/* Main (Generated Result) */}
      <div className="flex flex-col gap-4 order-1 md:order-2">
        <div className="flex flex-wrap justify-between items-center bg-slate-800/50 p-2 rounded-xl border border-slate-700/50 md:bg-transparent md:p-0 md:border-0 gap-y-2 min-h-[44px]">
           <h3 className="text-indigo-400 font-bold text-sm uppercase tracking-wider ml-2 rtl:mr-2 rtl:ml-0 md:ml-0 md:rtl:mr-0">{t('generatedResult')}</h3>
           
           <div className="flex items-center gap-1 sm:gap-2 ml-auto">
             <button
               onClick={() => setIsCompareMode(!isCompareMode)}
               className={`p-2 sm:p-1.5 rounded-lg transition-all touch-manipulation flex items-center gap-2 ${isCompareMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
               title="Compare with Original"
             >
               <SplitSquareHorizontal className="w-5 h-5 sm:w-4 sm:h-4" />
               <span className="text-xs font-medium hidden sm:inline">Compare</span>
             </button>

             <div className="h-6 w-px bg-slate-700 mx-1" />

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
          {isCompareMode ? (
             <CompareSlider original={originalImage} generated={generatedImage} />
          ) : (
            <>
              {/* Base Image with Color Filters */}
              <img 
                src={generatedImage} 
                alt="Generated headshot" 
                className="w-full h-full object-cover relative z-0 transition-all duration-500"
                style={{ filter: getFilterStyle() }}
                decoding="async"
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
            </>
          )}

          <div className="absolute inset-0 pointer-events-none ring-inset ring-1 ring-white/10 rounded-2xl z-20"></div>
        </div>

        {/* Controls only visible if NOT in compare mode */}
        {!isCompareMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
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
        )}

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
