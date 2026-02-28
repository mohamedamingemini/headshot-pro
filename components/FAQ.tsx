
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ: React.FC = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { q: t('faq1Q'), a: t('faq1A') },
    { q: t('faq2Q'), a: t('faq2A') },
    { q: t('faq3Q'), a: t('faq3A') },
    { q: t('faq4Q'), a: t('faq4A') }
  ];

  return (
    <section className="py-16 sm:py-24 w-full border-t border-slate-800">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{t('faqTitle')}</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden transition-all"
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left rtl:text-right hover:bg-slate-700/30 transition-colors"
              >
                <span className="font-semibold text-white">{faq.q}</span>
                {openIndex === i ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              
              {openIndex === i && (
                <div className="px-6 pb-5 text-slate-400 leading-relaxed animate-fadeIn">
                  {faq.a}
                  <div className="mt-4 pt-4 border-t border-slate-700/50 text-xs italic">
                    Was this helpful? We are constantly improving our AI models based on user feedback to ensure the highest quality professional headshots.
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Still have questions?</h3>
          <p className="text-slate-400 mb-6 leading-relaxed">
            We understand that choosing the right professional image is a big decision. If you couldn't find the answer you were looking for in our FAQ, our dedicated support team is ready to assist you. We can provide guidance on photo selection, style choices, and how to get the most out of our AI technology.
          </p>
          <p className="text-slate-300 font-medium">
            Contact us at <a href="mailto:mohamed.fbaky@gmail.com" className="text-indigo-400 hover:underline">mohamed.fbaky@gmail.com</a> and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
