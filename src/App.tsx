import { useEffect } from 'react';
import { ScrollTrigger, startSmoothScroll, reducedMotion, finePointer } from './motion/setup';
import { chapters } from './motion/gauge';
import { chaptersList } from './content';
import Header from './components/Header';
import Rail from './components/Rail';
import Cursor from './components/Cursor';
import Hero from './components/Hero';
import Mission from './components/Mission';
import Nmes from './components/Nmes';
import Flight from './components/Flight';
import Orbit from './components/Orbit';
import Archive from './components/Archive';
import FlightPlan from './components/FlightPlan';
import Recognition from './components/Recognition';
import Ending from './components/Ending';

export default function App() {
  useEffect(() => {
    const lenis = startSmoothScroll();
    if (finePointer() && !reducedMotion()) document.documentElement.classList.add('has-cursor');

    // Chapter tracking for header, rail and the H·S·E motif.
    const triggers = chaptersList.map(({ id }) =>
      ScrollTrigger.create({
        trigger: `#${id}`,
        start: 'top 50%',
        end: 'bottom 50%',
        onToggle: (self) => self.isActive && chapters.set(id),
      }),
    );

    // Layout settles once the webfonts arrive; re-measure every pinned composition.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);

    return () => {
      triggers.forEach((t) => t.kill());
      window.removeEventListener('load', onLoad);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <a className="sr" href="#main">Skip to content</a>
      <Header />
      <Rail />
      <Cursor />
      <main id="main">
        <Hero />
        <Mission />
        <Nmes />
        <Flight />
        <Orbit />
        <Archive />
        <FlightPlan />
        <Recognition />
        <Ending />
      </main>
    </>
  );
}
