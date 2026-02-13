import React, { useState, useMemo } from 'react';
import { HeadshotStyle } from '../types';
import { HEADSHOT_STYLES } from '../constants';
import { Check, Loader2, Sparkles, Wand2, Play } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AdSense from './AdSense';
import { generateHeadshot } from '../services/geminiService';

interface StyleSelectorProps {
  selectedStyleId: string | null;
  onSelectStyle: (styleId: string) => void;
  originalImage: string;
}

type StyleItem = HeadshotStyle | { id: string; isAd: boolean };

const getPreviewStyle = (styleId: string): React.CSSProperties => {
  switch (styleId) {
    case 'corporate': // Clean, neutral, professional
      return { filter: 'grayscale(0.1) contrast(1.1) brightness(1.05)' };
    case 'tech-office': // Bright, modern, slightly cool
      return { filter: 'brightness(1.1) saturate(1.1) hue-rotate(-5deg)' };
    case 'outdoor': // Warm, sunny, vibrant
      return { filter: 'sepia(0.2) saturate(1.3) brightness(1.1) contrast(1.1)' };
    case 'studio-dark': // Moody, high contrast, dimmer
      return { filter: 'brightness(0.8) contrast(1.4) saturate(0.9)' };
    case 'creative': // Vibrant, punchy
      return { filter: 'saturate(1.4) contrast(1.15) brightness(1.05)' };
    case 'minimalist': // High key, desaturated, clean
      return { filter: 'brightness(1.2) saturate(0.8) contrast(1.05)' };
    case 'vintage': // Sepia, faded, retro
      return { filter: 'sepia(0.5) contrast(1.1) brightness(0.95)' };
    case 'cyberpunk': // Neon, high contrast, cool shift
      return { filter: 'contrast(1.3) saturate(1.4) hue-rotate(10deg)' };
    case 'soft-portrait': // Soft, dreamy, low contrast
      return { filter: 'brightness(1.1) contrast(0.9) blur(0.5px) saturate(0.9)' };
    default:
      return {};
  }
};

const getOverlayClass = (styleId: string): string => {
  switch (styleId) {
    case 'studio-dark': return 'bg-black/30 mix-blend-multiply';
    case 'cyberpunk': return 'bg-gradient-to-tr from-purple-500/20 to-cyan-500/20 mix-blend-overlay';
    case 'vintage': return 'bg-yellow-900/10 mix-blend-overlay';
    case 'outdoor': return 'bg-orange-500/10 mix-blend-soft-light';
    case 'soft-portrait': return 'bg-white/10 mix-blend-soft-light';
    case 'corporate': return 'bg-slate-500/10 mix-blend-overlay';
    default: return 'bg-transparent';
  }
};

const StyleCard: React.FC<{
  style: HeadshotStyle;
  isSelected: boolean;
  onSelect: () => void;
  originalImage: string;
}> = ({ style, isSelected, onSelect, originalImage }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const { language, t } = useLanguage();

  const handleGeneratePreview = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent selecting the card while clicking preview
    if (isGeneratingPreview || previewImage || !originalImage) return;

    setIsGeneratingPreview(true);
    try {
      // Use the prompt modifier to generate a real preview
      const result = await generateHeadshot(originalImage, style.promptModifier);
      setPreviewImage(result);
    } catch (error) {
      console.error("Failed to generate preview:", error);
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  return (
    <div 
      onClick={onSelect}
      className={`
        relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all duration-300
        ${isSelected 
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 scale-[1.02]' 
          : 'border-slate-700 hover:border-slate-500 hover:scale-[1.01]'}
      `}
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-800 relative">
           {/* Loading State for Main Thumbnail */}
           {!isLoaded && (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
               <Loader2 className="w-8 h-8 text-slate-600 animate-spin" />
             </div>
           )}
           
           {/* Layer 1: Generic Style Thumbnail (Visible by default) */}
           <img 
             src={style.thumbnail} 
             alt={style.name}
             onLoad={() => setIsLoaded(true)}
             className="w-full h-full object-cover absolute inset-0 z-0 transition-transform duration-700 group-hover:scale-110"
           />

           {/* Layer 2: User CSS Preview (Visible on Hover or Selected, if no AI preview) */}
           {originalImage && !previewImage && (
             <div className={`
               absolute inset-0 z-10 transition-opacity duration-300 bg-slate-900
               ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
             `}>
                <img 
                  src={originalImage} 
                  alt="Preview"
                  style={getPreviewStyle(style.id)}
                  className="w-full h-full object-cover"
                />
                <div className={`absolute inset-0 ${getOverlayClass(style.id)}`} />
             </div>
           )}

           {/* Layer 3: AI Generated Preview (Visible if exists) */}
           {previewImage && (
             <div className="absolute inset-0 z-20 bg-slate-900 animate-fadeIn">
                <img 
                  src={previewImage} 
                  alt="AI Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-indigo-600/90 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                   <Sparkles className="w-3 h-3" />
                   <span>AI Preview</span>
                </div>
             </div>
           )}
           
           {/* Text Overlay Gradient */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none z-20" />
           
           {isSelected && (
             <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 bg-indigo-600 text-white p-1 rounded-full shadow-lg z-30">
               <Check className="w-4 h-4" />
             </div>
           )}

           {/* Magic Preview Button (Visible on Hover if no preview exists yet) */}
           {originalImage && !previewImage && !isSelected && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-90 group-hover:scale-100">
                <button
                  onClick={handleGeneratePreview}
                  disabled={isGeneratingPreview}
                  className="bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-xl font-medium text-xs sm:text-sm transition-colors"
                >
                  {isGeneratingPreview ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Wand2 className="w-4 h-4 text-indigo-300" />
                  )}
                  {isGeneratingPreview ? 'Generating...' : 'AI Preview'}
                </button>
             </div>
           )}

           {/* Badge for CSS Preview */}
           {!previewImage && !isSelected && originalImage && (
              <div className="absolute top-2 right-2 rtl:right-auto rtl:left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1 pointer-events-none">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>{t('preview')}</span>
              </div>
           )}

           <div className="absolute bottom-0 left-0 rtl:left-auto rtl:right-0 p-4 w-full z-20">
             <h3 className="text-lg font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
               {language === 'ar' ? style.name_ar : style.name}
             </h3>
             <p className="text-xs text-slate-300 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
               {language === 'ar' ? style.description_ar : style.description}
             </p>
           </div>
      </div>
    </div>
  );
};

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyleId, onSelectStyle, originalImage }) => {
  const { t } = useLanguage();

  // Memoize the items with the Ad shuffled in, so it doesn't move on re-renders
  const items = useMemo(() => {
    // Create a copy of the styles array
    const shuffledStyles: StyleItem[] = [...HEADSHOT_STYLES];
    // Create an Ad item
    const adItem = { id: 'adsense-block-tile', isAd: true };
    // Generate a random index. length is 9, so index can be 0 to 9.
    const randomIndex = Math.floor(Math.random() * (shuffledStyles.length + 1));
    // Insert the ad
    shuffledStyles.splice(randomIndex, 0, adItem);
    return shuffledStyles;
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-white mb-6 text-center">{t('chooseStyle')}</h2>
      <p className="text-center text-slate-400 mb-8 -mt-4 text-sm">{t('hoverPreview')}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          if ('isAd' in item && item.isAd) {
             return (
                 <div key={item.id} className="relative rounded-xl overflow-hidden border-2 border-slate-700/50 bg-slate-800 aspect-[4/3] group">
                    {/* Visual styling to match StyleCard but for Ad */}
                     <span className="absolute top-0 right-0 z-20 bg-slate-900/80 text-[10px] text-slate-400 px-2 py-1 rounded-bl-lg border-b border-l border-slate-700 uppercase tracking-wider">
                         Ad
                     </span>
                     <div className="w-full h-full flex items-center justify-center bg-slate-900">
                        <AdSense 
                            slot="8901234567" // Placeholder for the shuffled tile ad
                            variant="card"
                            format="rectangle"
                            className="flex items-center justify-center"
                        />
                     </div>
                     {/* Overlay gradient to match style cards slightly */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none z-10 border-2 border-transparent group-hover:border-slate-600 transition-colors rounded-xl" />
                 </div>
             );
          }
          
          const style = item as HeadshotStyle;

          return (
            <StyleCard
                key={style.id}
                style={style}
                isSelected={selectedStyleId === style.id}
                onSelect={() => onSelectStyle(style.id)}
                originalImage={originalImage}
            />
          );
        })}
      </div>
    </div>
  );
};

export default StyleSelector;