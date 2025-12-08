import { motion } from 'framer-motion';
import { HeroScene } from '../components/canvas/HeroScene';

export const Hero = () => {
    return (
        <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
            {/* Always render scene to persist state */}
            <HeroScene />
      
            {/* Background Logo Watermark - Removed for clarity as per user request */}

            <div className="z-10 w-full max-w-7xl mx-auto px-4 pointer-events-none select-none flex flex-col items-center justify-center h-full relative">
                {/* Modern Glow/Glass Effect Wrapper */}
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
                    animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                    className="relative flex justify-center items-center"
                >
                    {/* Performance optimized glow: Static radial gradient instead of dynamic drop-shadow */}
                    <div 
                        className="absolute inset-0 bg-[radial-gradient(circle,rgba(102,252,241,0.2)_0%,transparent_70%)] opacity-60 blur-3xl"
                        style={{ pointerEvents: 'none', transform: 'scale(1.2)' }}
                    />

                    <img 
                        src="/hero-logo.png" 
                        alt="Ritter der Würfelrunde" 
                        className="relative z-10 w-full max-w-[1600px] h-auto object-contain translate-x-[5%] md:translate-x-[8%] transform scale-110 md:scale-155"
                        style={{ filter: 'none' }} // Ensure no drop-shadow
                    />
                    
                </motion.div>

                <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   transition={{ duration: 1, delay: 1 }}
                   className="mt-12 md:mt-24"
                >
                     <p className="text-silver/60 font-tactical max-w-lg mx-auto text-center text-sm md:text-base tracking-wider">
                        Der Verein für alle TableTop-Gamer in Wiesbaden und Umgebung.
                     </p>
                </motion.div>
            </div>
        </section>
    );
};
