import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'

// Dynamic import wrapper to catch load errors (like Avast blocking chunks)
export function Bootstrap() {
  const [App, setApp] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    import('./App')
      .then((m) => setApp(() => m.default))
      .catch((e) => {
        console.error("Failed to load App module", e);
        setError(e);
      });
  }, []);

  if (error) {
    return (
      <div className="p-10 text-crimson font-medieval min-h-screen bg-[#1a120b] flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold mb-4 drop-shadow-md">FLUCH DER TECHNIK</h1>
        <p className="text-parchment font-sans text-lg">Die Pforten konnten nicht geöffnet werden.</p>
        <div className="p-6 bg-[#2c1810] mt-6 rounded-sm border-2 border-crimson shadow-xl max-w-lg">
            <p className="font-mono text-sm text-parchment/70 mb-2">FEHLERPROTOKOLL:</p>
            {error.message}
        </div>
        <p className="mt-6 text-sm text-gold/60 font-serif italic max-w-md">
            Möglicherweise blockiert ein Drache (Antivirus/Netzwerk) den Zugang zum Königreich.
        </p>
      </div>
    );
  }

  if (!App) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#1a120b] text-gold font-medieval text-2xl tracking-widest animate-pulse">
        DIE TORE WERDEN GEÖFFNET...
      </div>
    );
  }

  return (
    <HelmetProvider>
      <App />
    </HelmetProvider>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
)
