
import React from 'react';
import { Upload, Palette, Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const HowItWorks: React.FC = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: <Upload className="w-8 h-8" />,
      title: t('step1Title'),
      desc: t('step1Desc'),
      number: '01'
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: t('step2Title'),
      desc: t('step2Desc'),
      number: '02'
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t('step3Title'),
      desc: t('step3Desc'),
      number: '03'
    }
  ];

  return (
    <section className="py-16 sm:py-24 w-full border-t border-slate-800">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('howItWorksTitle')}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">{t('howItWorksSubtitle')}</p>
      </div>

      <div className="relative">
        {/* Connector Line */}
        <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 z-0" />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-slate-900 border-4 border-slate-800 rounded-full flex items-center justify-center text-indigo-500 shadow-xl">
                  {s.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold border-2 border-slate-900">
                  {s.number}
                </div>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
              <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20 grid md:grid-cols-2 gap-12 items-start">
        <div className="bg-slate-800/20 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">Behind the Scenes: Our AI Engine</h3>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>
              When you upload your photo, our system performs a multi-stage analysis. First, it identifies key facial landmarks to ensure that the generated headshot maintains your unique identity. We use advanced facial recognition technology to map the structure of your face, ensuring that the results are authentic and recognizable.
            </p>
            <p>
              Next, the AI evaluates the lighting and background of your original photo. It then intelligently "re-lights" your face using virtual studio lighting setups. This process involves adjusting highlights and shadows to create depth and professional polish, similar to what a professional photographer would do in a studio.
            </p>
            <p>
              Finally, the system applies the selected professional style. This includes generating realistic business attire, professional backgrounds, and fine-tuning the overall color balance and sharpness. The result is a high-resolution, studio-quality headshot that is ready for any professional platform.
            </p>
          </div>
        </div>
        <div className="bg-slate-800/20 p-8 rounded-3xl border border-slate-800">
          <h3 className="text-xl font-bold text-white mb-4">Quality & Privacy Commitment</h3>
          <div className="space-y-4 text-sm text-slate-400 leading-relaxed">
            <p>
              We are committed to providing the highest quality results while maintaining the strictest privacy standards. Your uploaded photos are processed in real-time and are never stored permanently on our servers. We use secure, encrypted connections for all data transmissions.
            </p>
            <p>
              Our AI models are trained on diverse datasets to ensure that they work effectively for people of all ethnicities, ages, and genders. We continuously monitor and update our algorithms to reduce bias and improve the accuracy of our generations.
            </p>
            <p>
              If you're not satisfied with your results, you can always try a different style or upload a new photo. We provide tips on how to take the best "base" photo to ensure the AI has the highest quality input to work with, leading to even better professional headshots.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
