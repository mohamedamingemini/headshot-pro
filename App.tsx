import React, { useState } from 'react';
import Header from './components/Header';
import UploadZone from './components/UploadZone';
import StyleSelector from './components/StyleSelector';
import ResultDisplay from './components/ResultDisplay';
import Button from './components/Button';
import AdSense from './components/AdSense';
import ImageCropper from './components/ImageCropper';
import { generateHeadshot, editHeadshot } from './services/geminiService';
import { AppState, ChatMessage } from './types';
import { HEADSHOT_STYLES } from './constants';
import { Wand2, AlertCircle } from 'lucide-react';
import { useLanguage } from './contexts/LanguageContext';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('upload');
  // tempImage holds the raw uploaded image before cropping
  const [tempImage, setTempImage] = useState<string | null>(null);
  // originalImage holds the final cropped/confirmed image to be used for generation
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, language } = useLanguage();
  
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

    const style = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
    if (!style) return;

    setIsGenerating(true);
    setError(null);

    try {
      const resultImage = await generateHeadshot(originalImage, style.promptModifier);
      
      setCurrentImage(resultImage);
      // Initialize history
      setImageHistory([resultImage]);
      setHistoryIndex(0);
      
      setAppState('result');
      
      // Initialize chat with the result
      const styleName = language === 'ar' ? style.name_ar : style.name;
      setChatMessages([
        {
          id: 'init',
          role: 'assistant',
          text: language === 'ar' 
            ? `ها هي صورة ${styleName}! أخبرني إذا كنت تريد إجراء أي تعديلات، مثل "اجعل الخلفية أفتح" أو "أضف ابتسامة".`
            : `Here is your ${styleName} headshot! Let me know if you want to make any edits, like "Make the background lighter" or "Add a smile".`,
          timestamp: Date.now()
        }
      ]);

    } catch (err: any) {
      setError(err.message || t('errorGeneric'));
    } finally {
      setIsGenerating(false);
    }
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
      // We edit the CURRENT image
      const newImage = await editHeadshot(currentImage, text);
      
      // Update History: remove future history if we edited from the middle
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
    setSelectedStyleId(null);
    setChatMessages([]);
    setImageHistory([]);
    setHistoryIndex(-1);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-12">
      <Header onReset={handleReset} canReset={appState !== 'upload'} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl flex items-center gap-3 text-red-200 animate-fadeIn">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

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
             
             {/* Ad Placement 1: Below content on landing page */}
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
            
            {/* Ad Placement 2: High visibility banner before action */}
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
              onUndo={handleUndo}
              onRedo={handleRedo}
              canUndo={historyIndex > 0}
              canRedo={historyIndex < imageHistory.length - 1}
              chatMessages={chatMessages}
              onSendMessage={handleEditMessage}
              isProcessing={isGenerating}
            />

            {/* Ad Placement 3: Moved below the consolidated ResultDisplay (which now includes Chat) */}
            <AdSense slot="3456789012" />

          </div>
        )}
      </main>
    </div>
  );
};

export default App;