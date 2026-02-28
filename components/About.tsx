
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

      <div className="prose prose-invert max-w-none mb-12">
        <h2 className="text-2xl font-bold text-white mb-4">Our Story</h2>
        <p className="mb-6">
          Founded in 2024, ProHeadshot AI was born out of a simple observation: professional photography is often too expensive, time-consuming, and geographically limited for the average job seeker, entrepreneur, or remote professional. We saw a world where talented individuals were being held back by a lack of access to high-quality visual branding. We believed that the latest breakthroughs in Generative AI could bridge this gap, democratizing professional portraiture for everyone, regardless of their budget or location.
        </p>
        <p className="mb-6">
          Our team of engineers and designers spent months researching the nuances of professional photography. We studied everything from the classic three-point lighting setup to the subtle textures of various business fabrics. By leveraging Google's state-of-the-art Gemini technology, we've built a platform that doesn't just "filter" photos, but truly understands the structural and aesthetic requirements of a professional headshot.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
        <p className="mb-6">
          At ProHeadshot AI, our mission is to empower professionals worldwide by providing them with the tools they need to present their best selves to the world. We believe that a professional image should be a right, not a luxury. In an era where digital presence is often the primary way we connect with colleagues, clients, and employers, we are dedicated to making high-end photography accessible, affordable, and instantaneous.
        </p>

        <h2 className="text-2xl font-bold text-white mb-4">Why It Matters</h2>
        <p className="mb-6">
          In today's digital-first world, your profile picture is your digital handshake. It's the first thing people see on LinkedIn, company directories, personal portfolios, and social media platforms. A high-quality headshot communicates professionalism, confidence, and approachability. It builds trust before a single word is spoken.
        </p>
        <p className="mb-6">
          Research consistently shows that profiles with professional photos receive significantly more views and engagement. For job seekers, it can be the difference between getting an interview and being overlooked. For entrepreneurs, it's a critical part of building a personal brand that attracts investors and partners. We are proud to play a small part in helping our users achieve their professional goals through the power of AI.
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
