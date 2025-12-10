import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { HeroScene } from '../components/canvas/HeroScene';

export const Hero = () => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"]
    });


    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    return (
        <section ref={ref} className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-wood">
            {/* 3D Dice Scene (Restored) - Positioned behind content */}
            <div className="absolute inset-0 z-0">
                <HeroScene />
            </div>

            {/* Background/Overlay - Lighter wood tint, reduced opacity to let 3D show through */}
            <div className="absolute inset-0 pointer-events-none z-[1] bg-wood/30 mix-blend-multiply" />
            
            {/* Ambient Gold Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.1)_0%,transparent_70%)] pointer-events-none z-[1]" />

            {/* Content */}
            <motion.div 
                style={{ opacity }}
                className="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center h-full pointer-events-none select-none"
            >
                {/* Logo Container */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="relative flex justify-center items-center w-full"
                >
                    {/* Glow behind logo */}
                    <div 
                        className="absolute inset-0 bg-[radial-gradient(circle,rgba(197,160,89,0.2)_0%,transparent_70%)] opacity-60 blur-3xl scale-125"
                    />

                    <img 
                        src="/hero-logo.png" 
                        alt="Ritter der Würfelrunde" 
                        className="relative z-10 w-full max-w-[650px] md:max-w-[1000px] h-auto object-contain drop-shadow-[0_0_25px_rgba(197,160,89,0.3)] translate-x-4 md:translate-x-8 scale-125 md:scale-100 origin-center"
                    />
                </motion.div>

                {/* Subtitle / Description */}
                <motion.div
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 1, delay: 1 }}
                   className="mt-8 px-4 relative z-10"
                >
                     <p className="text-parchment/90 font-medieval max-w-lg mx-auto text-center text-lg md:text-xl tracking-widest uppercase border-t border-gold/40 pt-4 drop-shadow-md">
                        Der Verein für alle TableTop-Gamer in Wiesbaden und Umgebung.
                     </p>
                </motion.div>
            </motion.div>
            
            {/* Scroll Indicator */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-10 z-10 flex flex-col items-center gap-2 text-gold/70"
            >
                <span className="text-[10px] tracking-[0.3em] font-medieval uppercase text-shadow-sm">Scrollen</span>
                <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="w-px h-12 bg-gradient-to-b from-gold/0 via-gold/60 to-gold/0"
                />
            </motion.div>
        </section>
    );
};
