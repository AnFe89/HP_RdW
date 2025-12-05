import { Suspense } from 'react';
import { Loader } from '@react-three/drei';
import { Layout } from './components/Layout';
import { Hero } from './sections/Hero';
import { Services } from './sections/Services';
import { News } from './sections/News';
import { Footer } from './components/Footer';

function App() {
  return (
    <>
      <Layout>
        <Suspense fallback={null}>
            <Hero />
            <Services />
        </Suspense>
        <News />
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
