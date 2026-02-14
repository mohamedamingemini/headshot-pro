
import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, Sun, Moon, Flame, Snowflake, Zap, Feather, Smile, Eye, Image as ImageIcon, Palette, PaintBucket, PlusCircle, ScanFace, Stars, Activity, Triangle, Lightbulb, MoveHorizontal, Film, Aperture } from 'lucide-react';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatInterfaceProps {
  onSendMessage: (text: string, successMessage?: string) => Promise<void>;
  messages: ChatMessage[];
  isProcessing: boolean;
  className?: string;
}

interface QuickAction {
  labelKey: string;
  prompt: string;
  icon: React.ElementType;
  isInputPreset?: boolean;
  successMessageKey?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onSendMessage, messages, isProcessing, className = '' }) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();

  const quickActions: QuickAction[] = [
    { labelKey: 'qaCinematic', prompt: 'Add cinematic lighting', icon: Film, successMessageKey: 'successEdit' },
    { labelKey: 'qaSoftFocus', prompt: 'Apply a soft focus effect', icon: Aperture, successMessageKey: 'successEdit' },
    { labelKey: 'qaBrighter', prompt: 'Make the lighting brighter', icon: Sun, successMessageKey: 'successEdit' },
    { labelKey: 'qaDarker', prompt: 'Make the lighting darker', icon: Moon, successMessageKey: 'successEdit' },
    { labelKey: 'qaWarmer', prompt: 'Make the color tone warmer', icon: Flame, successMessageKey: 'successEdit' },
    { labelKey: 'qaCooler', prompt: 'Make the color tone cooler', icon: Snowflake, successMessageKey: 'successEdit' },
    { labelKey: 'qaContrast', prompt: 'Increase contrast', icon: Zap, successMessageKey: 'successEdit' },
    { labelKey: 'qaSoften', prompt: 'Soften the details gently', icon: Feather, successMessageKey: 'successEdit' },
    { labelKey: 'qaSharpen', prompt: 'Sharpen details and enhance image clarity', icon: Triangle, successMessageKey: 'successEdit' },
    { labelKey: 'qaGlow', prompt: 'Add a soft, subtle glow to the skin', icon: Lightbulb, successMessageKey: 'successEdit' },
    { labelKey: 'qaSymmetry', prompt: 'Subtly adjust the facial symmetry in the generated headshot for a more balanced appearance', icon: MoveHorizontal, successMessageKey: 'successEdit' },
    { labelKey: 'qaSmile', prompt: 'Add a natural smile', icon: Smile, successMessageKey: 'successEdit' },
    { labelKey: 'qaWhitenTeeth', prompt: 'Whiten teeth naturally', icon: Sparkles, successMessageKey: 'successEdit' },
    { labelKey: 'qaEyeSparkle', prompt: 'Enhance eye sparkle and catchlights', icon: Stars, successMessageKey: 'successEdit' },
    { labelKey: 'qaFixEyes', prompt: 'Fix eye clarity and focus', icon: Eye, successMessageKey: 'successEdit' },
    { labelKey: 'qaJawline', prompt: 'Slightly define and sharpen the jawline', icon: Activity, successMessageKey: 'successEdit' },
    { labelKey: 'qaEyeColor', prompt: 'Change eye color to ', icon: Palette, isInputPreset: true },
    { labelKey: 'qaNewBkg', prompt: 'Change background to ', icon: ImageIcon, isInputPreset: true },
    { labelKey: 'qaBgColor', prompt: 'Change background color to ', icon: PaintBucket, isInputPreset: true },
    { labelKey: 'qaAddProp', prompt: 'Add a ', icon: PlusCircle, isInputPreset: true },
    { labelKey: 'qaFaceShape', prompt: 'Adjust face shape: ', icon: ScanFace, isInputPreset: true },
  ];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isProcessing) return;
    
    const text = inputValue;
    setInputValue('');
    await onSendMessage(text);
  };

  const handleQuickAction = async (action: QuickAction) => {
    if (isProcessing) return;
    
    if (action.isInputPreset) {
      setInputValue(action.prompt);
      inputRef.current?.focus();
    } else {
      // Use the key to get the translated success message if available, otherwise default
      const successMsg = action.successMessageKey ? t(action.successMessageKey as any) : undefined;
      await onSendMessage(action.prompt, successMsg);
    }
  };

  return (
    <div className={`w-full max-w-2xl mx-auto flex flex-col h-[500px] max-h-[75vh] sm:h-[65vh] sm:min-h-[450px] sm:max-h-[700px] bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden shadow-xl backdrop-blur-sm transition-all ${className}`}>
      <div className="p-3 sm:p-4 bg-slate-800/80 border-b border-slate-700 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-indigo-400" />
        <h3 className="font-semibold text-white text-sm sm:text-base">{t('aiEditor')}</h3>
        <span className="text-[10px] sm:text-xs text-slate-400 ml-auto md:ml-auto rtl:mr-auto rtl:ml-0 hidden sm:inline">{t('editorModel')}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 scroll-smooth">
        {/* Welcome Message - only shows if no messages exist */}
        {messages.length === 0 && (
          <div className="text-center text-slate-400 my-auto pt-10 px-4">
            <p className="font-medium text-sm sm:text-base">{t('chatWelcome1')}</p>
            <p className="text-xs sm:text-sm mt-2 opacity-75">{t('chatWelcome2')}</p>
          </div>
        )}

        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
          >
            <div 
              className={`
                max-w-[90%] sm:max-w-[80%] rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-sm shadow-md
                ${msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none rtl:rounded-bl-none rtl:rounded-br-2xl' 
                  : 'bg-slate-700 text-slate-200 rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl'}
              `}
            >
              {msg.text && <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
              {msg.image && (
                <div className="mt-2 rounded-lg overflow-hidden border border-white/10">
                  <img src={msg.image} alt="Edit result" className="w-full h-auto" />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isProcessing && (
           <div className="flex justify-start animate-fadeIn">
             <div className="bg-slate-700 text-slate-200 rounded-2xl rounded-bl-none rtl:rounded-br-none rtl:rounded-bl-2xl px-4 py-3 text-sm flex items-center gap-2 shadow-md">
               <Loader2 className="w-4 h-4 animate-spin" />
               {t('applyingEdits')}
             </div>
           </div>
        )}
        <div ref={messagesEndRef} className="h-1" />
      </div>

      {/* Quick Actions Panel */}
      <div className="px-3 sm:px-4 py-2 sm:py-3 bg-slate-900/30 border-t border-slate-700">
         <p className="text-[10px] uppercase font-bold text-slate-500 mb-2 tracking-wider">{t('quickAdjustments')}</p>
         <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
            {quickActions.map((action) => (
              <button
                key={action.labelKey}
                onClick={() => handleQuickAction(action)}
                disabled={isProcessing}
                className="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 active:bg-slate-500 rounded-lg text-xs font-medium text-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-slate-600 hover:border-slate-500 touch-manipulation"
              >
                <action.icon className="w-3.5 h-3.5 text-indigo-400" />
                {t(action.labelKey as any)}
              </button>
            ))}
         </div>
      </div>

      <div className="p-3 sm:p-4 bg-slate-800 border-t border-slate-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('typeRequest')}
            className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            disabled={isProcessing}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isProcessing}
            className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-colors shrink-0 shadow-sm"
          >
            <Send className="w-5 h-5 rtl:-scale-x-100" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
