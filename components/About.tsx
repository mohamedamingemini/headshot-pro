
import React from 'react';
import Button from './Button';
import { ArrowLeft, Camera, Zap, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AboutProps {
  onBack: () => void;
}

const About: React.FC<AboutProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-300 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-white group">
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('back')}
      </Button>
      
      <div className="text-center mb-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6">{t('aboutTitle')}</h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          {t('aboutDesc')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
         <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
               <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">AI Powered</h3>
            <p className="text-sm text-slate-400">Leveraging Google's Gemini Nano technology for state-of-the-art image processing.</p>
         </div>
         <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 mb-4">
               <Camera className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">Studio Quality</h3>
            <p className="text-sm text-slate-400">Professional lighting and backgrounds without the expensive studio fees.</p>
         </div>
         <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center text-cyan-400 mb-4">
               <Users className="w-6 h-6" />
            </div>
            <h3 className="text-white font-semibold mb-2">For Everyone</h3>
            <p className="text-sm text-slate-400">Perfect for LinkedIn, resumes, corporate profiles, and social media.</p>
         </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900 border border-indigo-500/30 rounded-2xl p-8 text-center">
         <p className="text-xl font-medium text-white italic">"{t('aboutMission')}"</p>
      </div>
    </div>
  );
};

export default About;
