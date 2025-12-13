import { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'; 
import { Seo } from './components/Seo';
import { Layout } from './components/Layout';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { About } from './sections/About';
import { News } from './sections/News';
// import { Board } from './sections/Board';
import { Footer } from './components/Footer';
import { AdminDashboard } from './admin/AdminDashboard';
import { InviteConfirmation } from './components/invitation/InviteConfirmation';
import { supabase } from './lib/supabase';

function AppContent() {
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check admin role
    const checkRole = async () => {
       const { data: { user } } = await supabase.auth.getUser();
       if(user) {
          const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single();
          if(data?.role === 'admin') setIsAdmin(true);
       }
    };
    checkRole();
  }, []);

  // Admin View Standalone
  if (location.pathname === '/admin') {
     if (!isAdmin) return <div className="text-white text-center mt-20">ZUGRIFF VERWEIGERT</div>;
     
     return (
        <div className="relative min-h-screen bg-wood">
             <AdminDashboard />
             <button 
               onClick={() => window.location.href = '/'}
               className="fixed top-4 right-4 text-[#2c1810] hover:text-white border-2 border-[#2c1810] hover:bg-crimson px-6 py-3 bg-[#f5e6d3] shadow-lg font-bold tracking-widest z-[100] rounded-sm font-medieval transition-colors"
             >
               VERLASSEN
             </button>
        </div>
     );
  }

  return (
      <Layout>
        <Seo />
        <Routes>
            <Route path="/" element={
              <main>
                <Suspense fallback={null}>
                  <Hero />
                  <About />
                  <News />
                  <Services />
                </Suspense>
                {/* <Board /> */}
                <Footer />
              </main>
            } />
            
            <Route path="/invite" element={<InviteConfirmation />} />
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
  );
}

function App() {
  return (
    <Router>
       <AppContent />
    </Router>
  )
}

export default App
