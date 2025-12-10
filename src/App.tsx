import { Suspense } from 'react';
import { Layout } from './components/Layout';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { About } from './sections/About';
import { News } from './sections/News';
import { Board } from './sections/Board';
import { Footer } from './components/Footer';
import { AdminDashboard } from './admin/AdminDashboard';

function App() {
  return (
    <>
      <Layout>
        {window.location.pathname === '/admin' ? (
           <div className="relative min-h-screen bg-wood">
              <AdminDashboard />
              <button 
                onClick={() => window.location.href = '/'}
                className="fixed top-4 right-4 text-[#2c1810] hover:text-white border-2 border-[#2c1810] hover:bg-crimson px-6 py-3 bg-[#f5e6d3] shadow-lg font-bold tracking-widest z-[100] rounded-sm font-medieval transition-colors"
              >
                VERLASSEN
              </button>
           </div>
        ) : (
          <>
            <Suspense fallback={null}>
                <Hero />
                <About />
                <Services />
            </Suspense>
            <News />
            <Board />
            <Footer />
          </>
        )}
      </Layout>
    </>
  )
}

export default App
