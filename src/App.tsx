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
        <Suspense fallback={null}>
            <Hero />
            <Services />
        </Suspense>
        <News />
        <Board />
        
        {/* Simple URL-based routing for Admin until React Router is fully set up */}
        {window.location.pathname === '/admin' ? (
           <div className="fixed inset-0 z-50 bg-[#0b0c10] overflow-y-auto">
              <AdminDashboard />
              <button 
                onClick={() => window.location.href = '/'}
                className="fixed top-4 right-4 text-silver hover:text-white border border-silver/20 px-4 py-2 bg-black/50"
              >
                EXIT BRIDGE
              </button>
           </div>
        ) : null}

        <Footer />
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
