
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
          <p>By accessing or using ProHeadshot AI, you agree to be bound by these Terms and Conditions and our Privacy Policy. If you disagree with any part of these terms, you may not access the service. These terms apply to all visitors, users, and others who access or use the Service. Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">2. Service Description and AI Limitations</h2>
          <p>ProHeadshot AI uses advanced artificial intelligence algorithms to generate professional-grade headshots from user-uploaded photos. The service is provided "as is" and "as available". While we strive for high-quality results, we make no guarantees regarding the accuracy, photorealism, quality, or suitability of the generated images for any specific professional or personal purpose. AI-generated content may occasionally contain visual artifacts, inconsistencies, or unexpected results, which are inherent to the current state of generative technology.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">3. User Conduct and Content Restrictions</h2>
          <p>You are solely responsible for the content you upload to our service. You agree not to upload, post, or otherwise transmit any images that:</p>
          <ul className="list-disc ml-6 mt-2 space-y-2 text-slate-400">
            <li>Infringe on the intellectual property rights, copyrights, or trademarks of any third party.</li>
            <li>Contains explicit, pornographic, offensive, hateful, or illegal content.</li>
            <li>Violate the privacy or publicity rights of any individual without their express consent.</li>
            <li>Depict minors in any inappropriate or harmful manner.</li>
            <li>Are intended to deceive, harass, or harm others.</li>
          </ul>
          <p className="mt-4">We reserve the right to terminate your access to the service immediately and without notice if we determine, in our sole discretion, that you have violated any of these restrictions.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-white mb-3">4. Intellectual Property and Usage Rights</h2>
          <p>You retain all ownership rights to the original images you upload to ProHeadshot AI. By uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, process, and transmit your content solely for the purpose of providing the service to you. Regarding the generated images, you are granted a broad license to use them for personal and commercial purposes (such as LinkedIn profiles, company websites, and marketing materials), subject to the underlying terms of the Google Gemini API and applicable laws. You agree not to claim sole authorship of AI-generated images where prohibited by law.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
           <p>In no event shall ProHeadshot AI, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">6. Disclaimer of Warranties</h2>
           <p>Your use of the Service is at your sole risk. The Service is provided on an "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance. We do not warrant that the results obtained from the use of the service will be accurate or reliable.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">7. Governing Law</h2>
           <p>These Terms shall be governed and construed in accordance with the laws of the jurisdiction in which the service operates, without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.</p>
        </section>

        <section>
           <h2 className="text-xl font-semibold text-white mb-3">8. Changes to Terms</h2>
           <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsConditions;
