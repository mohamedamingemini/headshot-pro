
import React from 'react';
import { Zap, Clock, DollarSign, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const Features: React.FC = () => {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: t('feature1Title'),
      desc: t('feature1Desc'),
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: t('feature2Title'),
      desc: t('feature2Desc'),
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: t('feature3Title'),
      desc: t('feature3Desc'),
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: t('feature4Title'),
      desc: t('feature4Desc'),
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10'
    }
  ];

  return (
    <section className="py-16 sm:py-24 w-full">
      <div className="text-center mb-16">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('featuresTitle')}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto">{t('featuresSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700/50 hover:border-slate-600 transition-all group">
            <div className={`w-12 h-12 ${f.bg} ${f.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {f.icon}
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">{f.title}</h3>
            <p className="text-slate-400 leading-relaxed text-sm">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-20 bg-slate-800/30 rounded-3xl p-8 sm:p-12 border border-slate-700/50">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Why Professional Headshots Matter in the Digital Age</h3>
            <div className="space-y-4 text-slate-400 leading-relaxed">
              <p>
                In an increasingly remote and digital world, your online presence is your primary identity. Whether you're a software engineer looking for your next big role, a real estate agent building local trust, or a corporate executive leading a global team, your headshot is the first thing people see. It's the visual anchor of your professional brand.
              </p>
              <p>
                A high-quality, professional headshot conveys more than just what you look like. it signals that you take your career seriously, that you pay attention to detail, and that you are prepared for professional opportunities. It builds immediate credibility and trust, which are essential for successful networking and career advancement.
              </p>
              <p>
                With ProHeadshot AI, we've removed the barriers to entry. You no longer need to spend hundreds of dollars on a studio session or wait weeks for edits. Our AI technology provides you with studio-quality results in minutes, allowing you to keep your professional profiles fresh and relevant as your career evolves.
              </p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-indigo-400 font-semibold mb-2">Boost Your LinkedIn Visibility</h4>
              <p className="text-sm text-slate-400">Profiles with professional photos get up to 21x more views and 9x more connection requests. Don't let a low-quality selfie hold back your networking potential.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-purple-400 font-semibold mb-2">Consistency Across Platforms</h4>
              <p className="text-sm text-slate-400">Maintain a cohesive professional brand across LinkedIn, Twitter, GitHub, and your personal website. Consistency builds recognition and authority in your field.</p>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <h4 className="text-emerald-400 font-semibold mb-2">Confidence in Every Application</h4>
              <p className="text-sm text-slate-400">When you know you look your best, you carry that confidence into every interview and meeting. Let your headshot reflect the professional you truly are.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
