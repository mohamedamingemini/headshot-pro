
import React, { useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import Button from './Button';
import { useLanguage } from '../contexts/LanguageContext';
import { compressImage } from '../utils/canvasUtils';

interface UploadZoneProps {
  onImageSelected: (base64: string) => void;
}

const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError(t('errorType'));
      return;
    }

    // Allow up to 15MB because we compress client-side
    if (file.size > 15 * 1024 * 1024) { 
      setError(t('errorSize'));
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Compress image before passing it up
      // 1024px width is optimized for AI processing stability
      const compressedBase64 = await compressImage(file, 1024, 0.85);
      onImageSelected(compressedBase64);
    } catch (err) {
      console.error("Image processing error:", err);
      setError("Failed to process image. Please try another photo.");
    } finally {
      setIsProcessing(false);
      // Reset input value so same file can be selected again if needed
      if (event.target) {
        event.target.value = '';
      }
    }
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

        <Button 
          onClick={() => fileInputRef.current?.click()} 
          variant="primary" 
          className="w-full sm:w-auto"
          isLoading={isProcessing}
        >
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
