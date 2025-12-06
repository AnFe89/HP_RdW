import { useEffect, useState } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()_+-=[]{}|;:,.<>?';

interface GlitchTextProps {
  text: string;
  className?: string;
}

export const GlitchText = ({ text, className = '' }: GlitchTextProps) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((_, index) => {
            if (index < iteration) {
              return text[index];
            }
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );
      
      if (iteration >= text.length) {
        clearInterval(interval);
      }
      
      iteration += 1 / 3;
    }, 30);
    
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className={`relative inline-block ${className}`}>
        {/* Stabilizer: Reserves exact space for final text */}
        <span className="invisible opacity-0">{text}</span>
        
        {/* Animator: Overlays perfectly */}
        <span className="absolute top-0 left-0 w-full h-full text-center">
            {displayText}
        </span>
    </span>
  );
};
