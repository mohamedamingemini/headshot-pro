
import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import Button from './components/Button';
import AdSense from './components/AdSense';
import ImageCropper from './components/ImageCropper';
import Footer from './components/Footer';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';
import { generateHeadshotVariations, editHeadshot } from './services/geminiService';
import { checkDailyLimit, incrementDailyUsage } from './services/usageService';
import { AppState, ChatMessage } from './types';
import { HEADSHOT_STYLES } from './constants';
import { Wand2, AlertCircle } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';
import { useAuth } from './contexts/AuthContext';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  // State to remember where to go back to from legal pages
  const [previousState, setPreviousState] = useState<AppState>('upload');
  
  // tempImage holds the raw uploaded image before cropping
  const [tempImage, setTempImage] = useState<string | null>(null);
  // originalImage holds the final cropped/confirmed image to be used for generation
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  
  // Variations state
  const [variations, setVariations] = useState<string[]>([]);

  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  // History state
  const [imageHistory, setImageHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Chat state for editing
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleImageSelected = (base64: string) => {
    setTempImage(base64);
    setAppState('cropping');
    setError(null);
  };

  const handleCropComplete = (croppedBase64: string) => {
    setOriginalImage(croppedBase64);
    setAppState('style-selection');
  };

  const handleCropCancel = () => {
    setTempImage(null);
    setAppState('upload');
  };

  const handleStyleSelected = (id: string) => {
    setSelectedStyleId(id);
    setError(null);
  };

  const handleGenerate = async () => {
    if (!originalImage || !selectedStyleId) return;

    // Check Daily Limit with User ID
    const limitCheck = checkDailyLimit(user?.uid);
    if (!limitCheck.allowed) {
      setError(t('dailyLimitReached').replace('{time}', limitCheck.timeRemainingStr || '24h'));
      return;
    }

    const style = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
    if (!style) return;

    setIsGenerating(true);
    setError(null);

    try {
      // Generate 4 variations instead of just one
      const generatedResults = await generateHeadshotVariations(originalImage, style.promptModifier, 4);
      
      // If successful, increment usage count with User ID
      incrementDailyUsage(user?.uid);

      setVariations(generatedResults);
      setCurrentImage(generatedResults[0]); // Select the first one by default
      
      // Initialize history with the first one
      setImageHistory([generatedResults[0]]);
      setHistoryIndex(0);
      
      setAppState('result');
      
      // Initialize chat with the result
      const styleName = language === 'ar' ? style.name_ar : style.name;
      setChatMessages([
        {
          id: 'init',
          role: 'assistant',
          text: language === 'ar' 
            ? `ها هي صور ${styleName}! لقد قمت بإنشاء عدة تنويعات لك. اختر النسخة التي تفضلها، وأخبرني إذا كنت تريد إجراء أي تعديلات.`
            : `Here are your ${styleName} headshots! I've generated a few variations. Select the one you like best, and let me know if you want to make any edits.`,
          timestamp: Date.now()
        }
      ]);

    } catch (err: any) {
      setError(err.message || t('errorGeneric'));
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleGenerateMore = async () => {
    if (!originalImage || !selectedStyleId) return;

    // Check Daily Limit for "Generate More" as well
    const limitCheck = checkDailyLimit(user?.uid);
    if (!limitCheck.allowed) {
      setError(t('dailyLimitReached').replace('{time}', limitCheck.timeRemainingStr || '24h'));
      return;
    }

    const style = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
    if (!style) return;

    setIsGenerating(true);
    
    try {
      // Generate 4 more variations
      const newVariations = await generateHeadshotVariations(originalImage, style.promptModifier, 4);
      
      // If successful, increment usage count with User ID
      incrementDailyUsage(user?.uid);

      setVariations(prev => [...prev, ...newVariations]);
    } catch (err: any) {
      setError(err.message || t('errorGeneric'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleVariationSelect = (image: string) => {
    setCurrentImage(image);
    setImageHistory([image]);
    setHistoryIndex(0);
  };

  const handleEditMessage = async (text: string, customSuccessMessage?: string) => {
    if (!currentImage) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };
    
    setChatMessages(prev => [...prev, userMsg]);
    setIsGenerating(true);
    
    try {
      const newImage = await editHeadshot(currentImage, text);
      
      const newHistory = imageHistory.slice(0, historyIndex + 1);
      newHistory.push(newImage);
      
      setImageHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      setCurrentImage(newImage);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: customSuccessMessage || t('successEdit'),
        timestamp: Date.now()
      };
      
      setChatMessages(prev => [...prev, assistantMsg]);

    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        text: `${t('errorEdit')} ${err.message}`,
        timestamp: Date.now()
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentImage(imageHistory[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < imageHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentImage(imageHistory[newIndex]);
    }
  };

  const handleReset = () => {
    setAppState('upload');
    setOriginalImage(null);
    setTempImage(null);
    setCurrentImage(null);
    setVariations([]);
    setSelectedStyleId(null);
    setChatMessages([]);
    setImageHistory([]);
    setHistoryIndex(-1);
    setError(null);
  };

  const handleLegalNavigation = (page: 'privacy' | 'terms') => {
    if (appState !== 'privacy' && appState !== 'terms') {
      setPreviousState(appState);
    }
    setAppState(page);
    window.scrollTo(0, 0);
  };

  const handleLegalBack = () => {
    setAppState(previousState);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col">
      <Header onReset={handleReset} canReset={appState !== 'upload' && appState !== 'privacy' && appState !== 'terms'} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8 w-full flex-grow pb-12">
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl flex items-center gap-3 text-red-200 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {appState === 'privacy' && <PrivacyPolicy onBack={handleLegalBack} />}
        {appState === 'terms' && <TermsConditions onBack={handleLegalBack} />}

        {appState === 'upload' && (
           <div className="flex flex-col items-center animate-fadeIn mt-6 sm:mt-12">
             <div className="text-center mb-8 sm:mb-10 px-4">
               <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
                 {t('heroTitle')} <br className="hidden sm:block" />
                 <span className="text-indigo-500 block sm:inline">{t('heroSubtitle')}</span>
               </h2>
               <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                 {t('heroDesc')}
               </p>
             </div>
             <UploadZone onImageSelected={handleImageSelected} />
             
             <AdSense slot="1234567890" className="mt-8 sm:mt-12" />
           </div>
        )}

        {appState === 'cropping' && tempImage && (
          <ImageCropper 
            imageSrc={tempImage}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}

        {appState === 'style-selection' && (
          <div className="space-y-6 sm:space-y-8 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-center border-b border-slate-800 pb-6 gap-4">
               <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="w-16 h-16 rounded-lg overflow-hidden border border-slate-600 shrink-0">
                    <img src={originalImage || ''} className="w-full h-full object-cover" alt="Source" />
                 </div>
                 <div>
                   <h3 className="text-lg font-medium text-white">{t('sourceImage')}</h3>
                   <button onClick={() => setAppState('upload')} className="text-sm text-indigo-400 hover:text-indigo-300">{t('changePhoto')}</button>
                 </div>
               </div>
               
               <Button 
                 onClick={handleGenerate} 
                 disabled={!selectedStyleId} 
                 isLoading={isGenerating}
                 className="w-full sm:w-auto min-w-[160px]"
               >
                 <Wand2 className="w-4 h-4 mr-2 rtl:ml-2 rtl:mr-0" />
                 {t('generateHeadshot')}
               </Button>
            </div>
            
            <AdSense slot="2345678901" />

            <StyleSelector 
              selectedStyleId={selectedStyleId} 
              onSelectStyle={handleStyleSelected} 
              originalImage={originalImage || ''}
            />
          </div>
        )}

        {appState === 'result' && originalImage && currentImage && (
          <div className="animate-fadeIn space-y-8 sm:space-y-12">
            
            <ResultDisplay 
              originalImage={originalImage}
              generatedImage={currentImage}
              variations={variations}
              onSelectVariation={handleVariationSelect}
              onGenerateMore={handleGenerateMore}
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < imageHistory.length - 1}
              chatMessages={chatMessages}
              onSendMessage={handleEditMessage}
              isProcessing={isGenerating}
            />

            <AdSense slot="3456789012" />

          </div>
        )}
      </main>

      <Footer onNavigate={handleLegalNavigation} />
    </div>
  );
};

export default App;
