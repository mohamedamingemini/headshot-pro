
import React, { useEffect, useState, useRef } from 'react';
import { AD_CONFIG } from '../constants';

interface AdSenseProps {
  slot: string;
  client?: string;
  format?: 'auto' | 'fluid' | 'rectangle' | 'vertical';
  responsive?: boolean;
  className?: string;
  variant?: 'banner' | 'card';
  style?: React.CSSProperties;
}

const AdSense: React.FC<AdSenseProps> = ({
  slot,
  client = AD_CONFIG.CLIENT_ID, 
  format = 'auto',
  responsive = true,
  className = '',
  variant = 'banner',
  style
}) => {
  const [isDev, setIsDev] = useState(false);
  const adPushed = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check for localhost or valid local IPs to show placeholder
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      setIsDev(true);
      return;
    }

    // Dynamically load AdSense script if not already present
    const existingScript = document.getElementById('adsense-script');
    if (!existingScript) {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    // Use ResizeObserver to detect exactly when the container has a width
    // This is more reliable than a timeout for "availableWidth=0" errors
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && !isReady) {
          setIsReady(true);
          observer.disconnect(); // Only need to trigger once
        }
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [isReady]);

  useEffect(() => {
    if (isDev || adPushed.current || !isReady) return;

    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || [];
      
      // Double check dimensions just before pushing
      if (containerRef.current && containerRef.current.offsetWidth > 0) {
        adsbygoogle.push({});
        adPushed.current = true;
      }
    } catch (e) {
      console.warn('AdSense push error:', e);
    }
  }, [isReady, isDev]);

  if (isDev) {
    return (
      <div className={`${variant === 'card' ? 'w-full h-full' : 'w-full flex justify-center my-4'} ${className}`}>
         <div className={`
           bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg 
           flex flex-col items-center justify-center text-slate-400 p-4
           ${variant === 'card' ? 'w-full h-full' : 'w-full max-w-[728px] py-8'}
         `}>
            <span className="font-semibold text-sm text-center">AdSense Placeholder</span>
            <span className="text-[10px] sm:text-xs opacity-75 text-center mt-1">
               Ads do not render on localhost.<br/>
               Slot ID: {slot}
            </span>
         </div>
      </div>
    );
  }

  const InsTag = () => (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', width: '100%', ...(variant === 'card' ? { height: '100%' } : {}), ...style }}
      data-ad-client={client}
      data-ad-slot={slot}
      data-ad-format={format}
      data-full-width-responsive={responsive ? "true" : "false"}
    />
  );

  return (
    <div 
      ref={containerRef} 
      className={`
        w-full overflow-hidden 
        ${variant === 'banner' ? 'flex flex-col items-center my-8' : 'h-full min-h-[100px]'} 
        ${className}
      `}
    >
      {variant === 'banner' ? (
        <div className="w-full max-w-[728px] bg-slate-800/30 rounded-lg overflow-hidden border border-slate-800/50 relative min-h-[90px] flex items-center justify-center">
          <span className="absolute top-0 right-0 bg-slate-800 text-[9px] text-slate-500 px-1.5 py-0.5 rounded-bl uppercase tracking-wider z-10">Ad</span>
          {isReady && <InsTag />}
          {!adPushed.current && (
            <div className="text-slate-700 text-xs font-mono absolute pointer-events-none opacity-20 select-none z-0">
              Sponsored
            </div>
          )}
        </div>
      ) : (
        <>
          <span className="absolute top-0 right-0 z-20 bg-slate-900/80 text-[10px] text-slate-400 px-2 py-1 rounded-bl-lg border-b border-l border-slate-700 uppercase tracking-wider">
            Ad
          </span>
          {isReady && <InsTag />}
        </>
      )}
    </div>
  );
};

export default AdSense;
