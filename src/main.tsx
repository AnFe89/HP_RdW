import { StrictMode, useState, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Dynamic import wrapper to catch load errors (like Avast blocking chunks)
function Bootstrap() {
  const [App, setApp] = useState<any>(null);
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
      <div className="p-10 text-red-500 font-mono">
        <h1 className="text-2xl font-bold mb-4">SYSTEM FAILURE</h1>
        <p>Could not load application modules.</p>
        <div className="p-4 bg-gray-900 mt-4 rounded border border-red-900">
            {error.message}
        </div>
        <p className="mt-4 text-sm text-gray-500">
            Diagnosis: An antivirus (Avast) or network blocker may be preventing the 3D engine from loading.
        </p>
      </div>
    );
  }

  if (!App) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0c10] text-[#66fcf1] font-mono">
        INITIALIZING SYSTEMS...
      </div>
    );
  }

  return <App />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Bootstrap />
  </StrictMode>,
)
