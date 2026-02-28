
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
          <p>Welcome to ProHeadshot AI. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you. Our goal is to provide a transparent and secure environment for all our users as they utilize our AI-powered professional headshot generation services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Data We Collect</h2>
          <p>We collect data to provide the best experience for our users. This includes several types of information that help us improve and deliver our services effectively:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-400">
            <li><strong className="text-slate-200">Images:</strong> The selfies you upload are processed to generate headshots. These images are sent securely to Google's Gemini API for processing. We do not permanently store your uploaded images or generated headshots on our servers. They are processed in memory and discarded after the session or refreshed. This ensures that your personal likeness is handled with the highest degree of privacy.</li>
            <li><strong className="text-slate-200">Usage Data:</strong> We may collect information about how you access and use the Service. This includes information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other diagnostic data.</li>
            <li><strong className="text-slate-200">Technical Data:</strong> Information about the device you use to access our site, including hardware model, operating system, and unique device identifiers.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. Advertising and Cookies (Google AdSense)</h2>
          <p>We use Google AdSense to display advertisements. Google and its partners use cookies to serve ads based on your prior visits to our website or other websites on the Internet. Cookies are small files placed on your device that help websites remember information about your visit.</p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-400">
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to our sites and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google Ads Settings</a>.</li>
            <li>Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">www.aboutads.info</a>.</li>
            <li>We also use analytical cookies to understand how our visitors interact with the website. This helps us provide a better user experience by identifying which pages are most useful and which ones need improvement.</li>
          </ul>
        </section>
        
        <section>
           <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
           <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement various security measures including encryption and secure socket layer (SSL) technology to protect your information during transmission.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h2>
           <p>We utilize the Google Gemini API for image generation. By using this application, you acknowledge that your input data (images and prompts) is processed by Google's generative AI models. This processing is necessary to provide the core functionality of our service. Please refer to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Google's Privacy Policy</a> for more information on how they handle data and their commitment to AI safety and privacy.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">6. Children's Privacy</h2>
           <p>Our Service does not address anyone under the age of 18 ("Children"). We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">7. Changes to This Privacy Policy</h2>
           <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page. Your continued use of the service after any modifications to the Privacy Policy will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Privacy Policy.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">8. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this website, please contact us through our contact page. We are dedicated to resolving any concerns you may have regarding your privacy and the handling of your data.</p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
