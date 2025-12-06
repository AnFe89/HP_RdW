import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
import { Layout } from './components/Layout';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { News } from './sections/News';
import { Board } from './sections/Board';
import { Footer } from './components/Footer';
import { AdminDashboard } from './admin/AdminDashboard';

function App() {
  return (
    <>
      <Layout>
        {window.location.pathname === '/admin' ? (
           <div className="relative min-h-screen bg-[#0b0c10]">
              <AdminDashboard />
              <button 
                onClick={() => window.location.href = '/'}
                className="fixed top-4 right-4 text-[#66fcf1] hover:text-white border border-[#66fcf1]/50 hover:bg-[#66fcf1]/10 px-6 py-3 bg-black/80 backdrop-blur-md shadow-[0_0_15px_rgba(102,252,241,0.2)] font-bold tracking-wider z-[100] rounded"
              >
                EXIT BRIDGE
              </button>
           </div>
        ) : (
          <>
            <Suspense fallback={null}>
                <Hero />
                <Services />
            </Suspense>
            <News />
            <Board />
            <Footer />
          </>
        )}
      </Layout>
      <Loader 
        containerStyles={{ background: '#0b0c10' }}
        innerStyles={{ width: '400px', height: '4px', background: '#333' }}
        barStyles={{ background: '#66fcf1', height: '4px' }}
        dataStyles={{ fontFamily: '"Share Tech Mono", monospace', color: '#c5c6c7', fontSize: '12px' }} 
        dataInterpolation={(p) => `LOADING BATTLEFIELD ASSETS... ${p.toFixed(0)}%`}
      />
    </>
  )
}

export default App
