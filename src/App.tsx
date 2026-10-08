import { useEffect } from 'react';
import { ScrollTrigger, startSmoothScroll, finePointer, reducedMotion } from './motion/setup';
import Cursor from './components/Cursor';
import Header from './components/Header';
import Intro from './components/Intro';
import Bio from './components/Bio';
import Contact from './components/Contact';
import { Publications, News } from './components/Listing';

export default function App() {
  useEffect(() => {
    const lenis = startSmoothScroll();
    if (finePointer() && !reducedMotion()) document.documentElement.classList.add('has-cursor');
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { lenis?.destroy(); };
  }, []);

  return (
    <>
      <a className="sr" href="#bio">Skip to biography</a>
      <Header />
      <Cursor />
      <main>
        <Intro />
        <Bio />
        <Publications />
        <News />
        <Contact />
      </main>
    </>
  );
}
