
import React, { useState, useRef, useEffect } from 'react';
import { ChevronsLeftRight } from 'lucide-react';

interface CompareSliderProps {
  original: string;
  generated: string;
  className?: string;
}

const CompareSlider: React.FC<CompareSliderProps> = ({ original, generated, className = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    
    // Calculate position percentage
    let position = ((clientX - containerRect.left) / containerRect.width) * 100;
    
    // Clamp between 0 and 100
    position = Math.max(0, Math.min(100, position));
    
    setSliderPosition(position);
  };

  const handleMouseDown = () => setIsDragging(true);

  // Global event listeners for dragging outside component
  useEffect(() => {
    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        // @ts-ignore
        handleMove(e);
      }
    };
    
    const handleGlobalUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMove);
      window.addEventListener('touchmove', handleGlobalMove);
      window.addEventListener('mouseup', handleGlobalUp);
      window.addEventListener('touchend', handleGlobalUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isDragging]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-ew-resize overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleMouseDown}
      // On click (without drag) instantly jump to position
      onClick={handleMove}
    >
      {/* Background Image (Generated/Modified) */}
      <img 
        src={generated} 
        alt="After" 
        className="absolute top-0 left-0 w-full h-full object-cover select-none pointer-events-none" 
      />

      {/* Foreground Image (Original) - Clipped */}
      <div 
        className="absolute top-0 left-0 h-full w-full select-none pointer-events-none"
        style={{ 
          clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
        }}
      >
        <img 
          src={original} 
          alt="Before" 
          className="w-full h-full object-cover" 
        />
      </div>

      {/* Slider Handle Line */}
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-[0_0_10px_rgba(0,0,0,0.5)] z-20"
        style={{ left: `${sliderPosition}%` }}
      >
        {/* Handle Button */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1.5 shadow-lg text-indigo-600">
           <ChevronsLeftRight className="w-4 h-4" />
        </div>
      </div>

      {/* Labels */}
      <div className="absolute top-4 left-4 bg-black/50 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-10 select-none">
        BEFORE
      </div>
      <div className="absolute top-4 right-4 bg-indigo-600/80 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur-sm pointer-events-none z-10 select-none">
        AFTER
      </div>
    </div>
  );
};

export default CompareSlider;
