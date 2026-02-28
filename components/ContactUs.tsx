
import React from 'react';
import Button from './Button';
import { ArrowLeft, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContactUsProps {
  onBack: () => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ onBack }) => {
  const { t } = useLanguage();
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-slate-300 animate-fadeIn">
      <Button variant="ghost" onClick={onBack} className="mb-6 pl-0 hover:bg-transparent hover:text-white group">
        <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
        {t('back')}
      </Button>
      
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-white mb-4">{t('contactTitle')}</h1>
        <p className="text-slate-400 mb-12 text-lg">{t('contactDesc')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-left">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Customer Support</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Have questions about your generated headshots? Our support team is here to help you get the best results. Whether it's a technical issue or a question about style selection, we're dedicated to ensuring you have a seamless experience. We typically respond to all inquiries within 24-48 business hours.
            </p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">
            <h3 className="text-white font-semibold mb-3">Partnerships & Press</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Are you interested in collaborating with ProHeadshot AI? We are always looking for strategic partners in the HR, recruitment, and career coaching spaces. For press inquiries or partnership proposals, please reach out with a detailed message so we can direct your request to the right team member.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 sm:p-12 shadow-xl mb-12">
           <div className="w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
             <Mail className="w-8 h-8 text-indigo-400" />
           </div>
           
           <h3 className="text-white font-medium mb-2">{t('contactEmailLabel')}</h3>
           <a 
             href="mailto:mohamed.fbaky@gmail.com" 
             className="text-2xl sm:text-3xl font-bold text-indigo-400 hover:text-indigo-300 transition-colors break-all"
           >
             mohamed.fbaky@gmail.com
           </a>
        </div>

        <div className="text-left bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50">
          <h2 className="text-xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h4 className="text-indigo-300 font-medium">How long does it take to get a response?</h4>
              <p className="text-sm text-slate-400">We strive to answer all emails within two business days. During peak times, it might take a bit longer, but we value every message we receive.</p>
            </div>
            <div>
              <h4 className="text-indigo-300 font-medium">Can I request a custom style?</h4>
              <p className="text-sm text-slate-400">We are constantly expanding our style library. If you have a specific professional look in mind that isn't currently available, please let us know! Your feedback helps us prioritize our AI training roadmap.</p>
            </div>
            <div>
              <h4 className="text-indigo-300 font-medium">Do you offer bulk pricing for teams?</h4>
              <p className="text-sm text-slate-400">Yes! We have special arrangements for corporate teams and recruitment agencies. Contact us via email for a custom quote tailored to your organization's needs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
