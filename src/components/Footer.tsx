import { useState } from 'react';
import { ImpressumModal } from './ImpressumModal';

export const Footer = () => {
    const [isImpressumOpen, setIsImpressumOpen] = useState(false);

    return (
        <>
            <footer className="w-full py-10 border-t-4 border-[#2c1810] bg-[#1a120b] text-center font-medieval text-parchment/60 text-xs relative">
                {/* Texture Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/wood-pattern.png')" }} />
                
                <div className="flex flex-col items-center gap-4 mb-4 relative z-10">
                    <div className="w-10 h-10 rounded-full border-2 border-gold/30 flex items-center justify-center text-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                        R
                    </div>
                </div>
                <p className="relative z-10 tracking-widest">RITTER DER WÜRFELRUNDE © {new Date().getFullYear()}</p>
                <div className="relative z-10 flex justify-center gap-4 mt-2">
                    <button 
                        onClick={() => setIsImpressumOpen(true)}
                        className="text-[10px] tracking-widest hover:text-gold transition-colors uppercase border-b border-transparent hover:border-gold/50 pb-0.5"
                    >
                        Impressum
                    </button>
                    <span className="text-[10px] text-parchment/30">|</span>
                    <a href="#" className="text-[10px] tracking-widest hover:text-gold transition-colors uppercase border-b border-transparent hover:border-gold/50 pb-0.5">
                        Datenschutz
                    </a>
                </div>
                <p className="mt-4 text-[10px] text-gold/40 font-serif italic max-w-md mx-auto relative z-10">
                    "DER SIEG GEHÖRT DENEN, DIE AN IHRE SACHE GLAUBEN."
                </p>
            </footer>

            <ImpressumModal 
                isOpen={isImpressumOpen} 
                onClose={() => setIsImpressumOpen(false)} 
            />
        </>
    )
}
