
import React from 'react';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TermsConditionsProps {
  onBack: () => void;
}

const TermsConditions: React.FC<TermsConditionsProps> = ({ onBack }) => {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-300 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-white group">
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('back')}
      </Button>

      <h1 className="text-3xl font-bold text-white mb-8">Terms and Conditions</h1>

      <div className="space-y-8 text-sm sm:text-base leading-relaxed bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Agreement to Terms</h2>
          <p>By accessing or using ProHeadshot AI, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access the service.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Service Description</h2>
          <p>ProHeadshot AI uses artificial intelligence to generate professional headshots from uploaded photos. The service is provided "as is" and we make no guarantees regarding the accuracy, quality, or suitability of the generated images for any specific purpose.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. User Conduct</h2>
          <p>You agree not to upload any images that:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-400">
            <li>Infringe on the intellectual property rights of others.</li>
            <li>Contains explicit, offensive, or illegal content.</li>
            <li>Violate the privacy of others.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property</h2>
          <p>You retain ownership of the original images you upload. You are granted a license to use the generated images for personal or commercial purposes, subject to Google's GenAI terms of service.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">5. Disclaimer</h2>
           <p>We do not guarantee that the service will be uninterrupted or error-free. The AI models may occasionally produce artifacts or unexpected results.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
