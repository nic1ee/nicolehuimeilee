import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, reducedMotion } from '../motion/setup';
import { chapters } from '../motion/gauge';
import { chaptersList } from '../content';
import { go } from './Header';

/**
 * H · S · E — Human, System, Environment as three hairlines whose relationship changes
 * with the chapter. Coordinates in a 40×40 box: [x1, y1, x2, y2].
 */
type L = [number, number, number, number];
const HSE: Record<string, [L, L, L]> = {
  hero:        [[4, 10, 36, 10], [4, 20, 36, 20], [4, 30, 36, 30]],      // apart, parallel
  mission:     [[4, 20, 36, 20], [12, 8, 28, 8], [12, 32, 28, 32]],      // the human, centred
  ta01:        [[4, 20, 36, 20], [6, 22, 34, 18], [4, 34, 36, 34]],      // system worn on the body
  flight:      [[10, 22, 30, 22], [10, 25, 30, 25], [20, 2, 20, 38]],    // environment dominates
  orbit:       [[4, 34, 36, 34], [4, 6, 36, 30], [4, 30, 36, 6]],        // system and environment cross
  index:       [[4, 12, 36, 12], [4, 20, 36, 20], [4, 28, 36, 28]],      // catalogue
  trajectory:  [[4, 34, 36, 8], [4, 30, 36, 8], [4, 26, 36, 8]],         // converging
  recognition: [[4, 22, 36, 22], [4, 20, 36, 20], [4, 18, 36, 18]],
  contact:     [[4, 20, 36, 20], [4, 20, 36, 20], [4, 20, 36, 20]],      // one line
};

export default function Rail() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lines = root.querySelectorAll<SVGLineElement>('.hse line');
    const ticks = root.querySelectorAll<HTMLLIElement>('.rail__ticks li');
    const fill = root.querySelector('.rail__fill');

    const st = ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (s) => gsap.set(fill, { scaleY: s.progress }),
    });

    const apply = (id: string) => {
      const cfg = HSE[id] ?? HSE.hero;
      lines.forEach((ln, i) => {
        const [x1, y1, x2, y2] = cfg[i];
        gsap.to(ln, { attr: { x1, y1, x2, y2 }, duration: reducedMotion() ? 0 : 1.1, ease: 'expo.inOut', overwrite: true });
      });
      ticks.forEach((t) => t.classList.toggle('on', t.dataset.id === id));
    };
    apply(chapters.get());
    const off = chapters.on(apply);
    return () => { st.kill(); off(); };
  }, []);

  return (
    <div className="rail mono" ref={ref} aria-label="Chapters">
      <div className="rail__track">
        <div className="rail__fill" />
        <ol className="rail__ticks">
          {chaptersList.map((c, i) => (
            <li key={c.id} data-id={c.id} style={{ top: `${(i / (chaptersList.length - 1)) * 100}%` }}>
              <a href={`#${c.id}`} onClick={(e) => go(e, `#${c.id}`)} aria-label={c.label} />
              <span>{c.label}</span>
            </li>
          ))}
        </ol>
      </div>
      <svg className="hse" viewBox="0 0 40 40" role="img" aria-label="Human, system, environment">
        <line className="h" x1="4" y1="10" x2="36" y2="10" />
        <line className="s" x1="4" y1="20" x2="36" y2="20" />
        <line className="e" x1="4" y1="30" x2="36" y2="30" />
        <text x="0" y="48">H·S·E</text>
      </svg>
    </div>
  );
}
