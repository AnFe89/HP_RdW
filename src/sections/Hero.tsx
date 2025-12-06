import { motion } from 'framer-motion';
import { HeroScene } from '../components/canvas/HeroScene';


export const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">
      <HeroScene />
      
      <div className="z-10 text-center space-y-4 mix-blend-difference pointer-events-none">
        <motion.h1 
            className="text-5xl sm:text-7xl md:text-9xl font-military text-silver uppercase tracking-tight leading-none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
        >
            RITTER DER <br/> <span className="text-transparent bg-clip-text bg-gradient-to-b from-silver to-void">WÜRFELRUNDE</span>
        </motion.h1>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: 1, delay: 1 }}
           className="mt-8"
        >
             <p className="text-silver/60 font-tactical max-w-lg mx-auto text-center">
                Der Verein für alle TableTop-Gamer in Wiesbaden und Umgebung.
             </p>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-10 z-10 flex flex-col items-center gap-2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <span className="text-[10px] text-neon font-tactical tracking-widest">SCROLL TO ENGAGE</span>
        <div className="w-px h-12 bg-gradient-to-b from-neon to-transparent" />
      </motion.div>
    </section>
  );
};
