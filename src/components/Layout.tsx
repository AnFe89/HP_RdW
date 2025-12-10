import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';


interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    // Custom "resistance" physics can be tweaked here by wrapping the raf
    // but default Lenis is already "heavy" enough with proper duration.

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>

      
      {/* Noise Overlay - Keeping for texture, but could be replaced with paper image */}
      <div className="fixed inset-0 pointer-events-none z-[50] opacity-[0.08] mix-blend-overlay"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`
           }}
      />

      {/* Vignette - Very Subtle / Removed for Modern Look */}
      <div className="fixed inset-0 pointer-events-none z-[40] bg-[radial-gradient(circle_at_center,transparent_0%,rgba(42,27,18,0.1)_120%)]" />

      {/* Main Content */}
      <main className="relative z-10 w-full min-h-screen bg-parchment text-ink selection:bg-gold selection:text-white">
        {children}
      </main>
    </>
  );
};
