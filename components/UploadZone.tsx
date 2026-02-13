import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('errorType'));
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError(t('errorSize'));
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      onImageSelected(base64);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-xl mx-auto p-6 sm:p-8 rounded-2xl bg-slate-800/50 border-2 border-dashed border-slate-600 hover:border-indigo-500 transition-all duration-300 text-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center">
          <UploadCloud className="w-8 h-8 text-indigo-400" />
        </div>
        
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">{t('uploadTitle')}</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto text-sm sm:text-base">
            {t('uploadSubtitle')}
          </p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <Button onClick={() => fileInputRef.current?.click()} variant="primary" className="w-full sm:w-auto">
          {t('selectPhoto')}
        </Button>
        
        {error && (
          <p className="text-red-400 text-sm mt-2 bg-red-900/20 px-3 py-1 rounded-full">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadZone;