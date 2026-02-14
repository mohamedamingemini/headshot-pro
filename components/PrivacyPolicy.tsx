
import React from 'react';
import Button from './Button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-300 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-white group">
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('back')}
      </Button>
      
      <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-sm sm:text-base leading-relaxed bg-slate-800/50 p-6 sm:p-8 rounded-2xl border border-slate-700">
        <section>
          <h2 className="text-xl font-semibold text-white mb-3">1. Introduction</h2>
          <p>Welcome to ProHeadshot AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Data We Collect</h2>
          <p>We collect data to provide the best experience for our users. This includes:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-400">
            <li><strong className="text-slate-200">Images:</strong> The selfies you upload are processed to generate headshots. These images are sent securely to Google's Gemini API for processing. We do not permanently store your uploaded images or generated headshots on our servers. They are processed in memory and discarded after the session or refreshed.</li>
            <li><strong className="text-slate-200">Usage Data:</strong> We may collect information about how you access and use the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Advertising and Cookies (Google AdSense)</h2>
          <p>We use Google AdSense to display advertisements. Google and its partners use cookies to serve ads based on your prior visits to our website or other websites on the Internet.</p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-400">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">www.aboutads.info</a>.</li>
          </ul>
        </section>
        
        <section>
           <h2 className="text-xl font-semibold text-white mb-3">4. Third-Party Services</h2>
           <p>We utilize the Google Gemini API for image generation. By using this application, you acknowledge that your input data (images and prompts) is processed by Google's generative AI models. Please refer to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google's Privacy Policy</a> for more information on how they handle data.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
