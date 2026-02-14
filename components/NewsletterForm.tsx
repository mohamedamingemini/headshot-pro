
import React, { useState } from 'react';
import { Send, Check, AlertCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { subscribeToNewsletter } from '../services/newsletterService';

const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      await subscribeToNewsletter(email);
      setStatus('success');
      setEmail('');
      
      // Reset success state after a few seconds so they can see the form again if needed
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error: any) {
      console.error(error);
      setStatus('error');
      setErrorMessage(error.message || t('subscribeError'));
    }
  };

  return (
    <div className="w-full max-w-sm">
      <h3 className="text-white font-semibold mb-2">{t('newsletterTitle')}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">
        {t('newsletterDesc')}
      </p>

      {status === 'success' ? (
        <div className="flex items-center gap-2 text-green-400 bg-green-900/20 px-4 py-3 rounded-xl border border-green-800 animate-fadeIn">
          <Check className="w-5 h-5 shrink-0" />
          <span className="font-medium text-sm">{t('subscribedSuccess')}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                required
                disabled={status === 'loading'}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shrink-0"
            >
              {status === 'loading' ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 rtl:-scale-x-100" />
              )}
            </button>
          </div>
          {status === 'error' && (
            <div className="absolute -bottom-6 left-0 flex items-center gap-1.5 text-red-400 text-xs animate-fadeIn">
              <AlertCircle className="w-3 h-3" />
              <span>{errorMessage}</span>
            </div>
          )}
        </form>
      )}
    </div>
  );
};

export default NewsletterForm;
