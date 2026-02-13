import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { ZoomIn, RotateCw, Check, X } from 'lucide-react';
import Button from './Button';
import { getCroppedImg } from '../utils/canvasUtils';
import { useLanguage } from '../contexts/LanguageContext';

interface ImageCropperProps {
  imageSrc: string;
  onCropComplete: (croppedImageBase64: string) => void;
  onCancel: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { t } = useLanguage();

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      if (croppedImage) {
        onCropComplete(croppedImage);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto animate-fadeIn">
      <div className="text-center mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{t('cropTitle')}</h2>
        <p className="text-slate-400 text-xs sm:text-sm">{t('cropSubtitle')}</p>
      </div>

      <div className="relative w-full h-[400px] sm:h-[60vh] bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-2xl mb-6">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          classes={{
            containerClassName: "bg-slate-900",
            mediaClassName: "",
            cropAreaClassName: "border-2 border-indigo-500 shadow-[0_0_0_9999px_rgba(15,23,42,0.8)]"
          }}
        />
      </div>

      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-6 border border-slate-700 backdrop-blur-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Zoom Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
              <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> {t('zoom')}</span>
              <span>{zoom.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rtl:rotate-180"
              style={{
                 background: `linear-gradient(to right, #6366f1 ${((zoom - 1) / 2) * 100}%, #334155 ${((zoom - 1) / 2) * 100}%)`
              }}
            />
          </div>

          {/* Rotation Control */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400 font-medium uppercase tracking-wider">
               <span className="flex items-center gap-1"><RotateCw className="w-3 h-3" /> {t('rotate')}</span>
               <span>{rotation}°</span>
            </div>
            <input
              type="range"
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby="Rotation"
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rtl:rotate-180"
              style={{
                 background: `linear-gradient(to right, #6366f1 ${(rotation / 360) * 100}%, #334155 ${(rotation / 360) * 100}%)`
              }}
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex-1 sm:w-32 sm:flex-none"
          >
            <X className="w-4 h-4 mr-2" />
            {t('cancel')}
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            isLoading={isProcessing}
            className="flex-1 sm:w-32 sm:flex-none"
          >
            {!isProcessing && <Check className="w-4 h-4 mr-2" />}
            {t('apply')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropper;