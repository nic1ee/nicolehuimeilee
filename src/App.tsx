import { useEffect } from 'react';
import { ScrollTrigger } from './motion/setup';
import Header from './components/Header';
import Intro from './components/Intro';
import Bio from './components/Bio';
import Contact from './components/Contact';

export default function App() {
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  }, []);

  return (
    <>
      <a className="sr" href="#bio">Skip to biography</a>
      <Header />
      <main>
        <Intro />
        <Bio />
        <Contact />
      </main>
    </>
  );
}
