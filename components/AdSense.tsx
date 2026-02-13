import React, { useEffect, useState } from 'react';

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
  client = 'ca-pub-7104907532767716', 
  format = 'auto',
  responsive = true,
  className = '',
  variant = 'banner',
  style
}) => {
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Check for localhost or valid local IPs to show placeholder
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('192.168.')) {
      setIsDev(true);
      return;
    }

    try {
      // @ts-ignore
      const adsbygoogle = window.adsbygoogle || [];
      adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense load error:', e);
    }
  }, []);

  if (isDev) {
    return (
      <div className={`${variant === 'card' ? 'w-full h-full' : 'w-full flex justify-center my-4'} ${className}`}>
         <div className={`
           bg-slate-800/50 border-2 border-dashed border-slate-600 rounded-lg 
           flex flex-col items-center justify-center text-slate-400 p-4
           ${variant === 'card' ? 'w-full h-full' : 'w-full max-w-[728px] py-8'}
         `}>
            <span className="font-semibold text-sm">AdSense Placeholder</span>
            <span className="text-[10px] sm:text-xs opacity-75 text-center mt-1">
               Ads do not render on localhost.<br/>
               Slot ID: {slot}
            </span>
         </div>
      </div>
    );
  }

  // Production render for Card variant (Style Selector)
  if (variant === 'card') {
    return (
      <div className={`w-full h-full overflow-hidden ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', height: '100%', ...style }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
      </div>
    );
  }

  // Production render for Banner variant (Standard)
  return (
    <div className={`w-full flex flex-col items-center my-8 ${className}`}>
      {/* Ad Container with compliant labeling */}
      <div className="w-full max-w-[728px] bg-slate-800/30 rounded-lg overflow-hidden border border-slate-800/50 relative min-h-[90px] flex items-center justify-center">
        <span className="absolute top-0 right-0 bg-slate-800 text-[9px] text-slate-500 px-1.5 py-0.5 rounded-bl uppercase tracking-wider z-10">Ad</span>
        <ins
          className="adsbygoogle"
          style={{ display: 'block', width: '100%', ...style }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
        {/* Fallback visual if ad fails to load in production */}
        <div className="text-slate-700 text-xs font-mono absolute pointer-events-none opacity-20 select-none z-0">
          Sponsored
        </div>
      </div>
    </div>
  );
};

export default AdSense;