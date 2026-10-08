import { useRef } from 'react';
import { useMotion } from '../motion/useMotion';
import { sectionLine, riseLines } from '../motion/reveals';
import { biography } from '../content';

/** Biography. The section rule draws, then each line rises from its baseline. */
export default function Bio() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, root) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      sectionLine(root);
      const undo = riseLines(root.querySelector<HTMLElement>('.bio__lead'));
      const p2 = root.querySelectorAll<HTMLElement>('.bio__p');
      const undos = Array.from(p2).map((p) => riseLines(p));
      return () => { undo(); undos.forEach((u) => u()); };
    });
  });

  return (
    <section id="bio" className="sec" ref={ref} aria-labelledby="bio-title">
      <div className="wrap"><div className="sec__line" aria-hidden="true"><i /><b /></div></div>
      <div className="wrap sec__grid">
        <div className="sec__lab">
          <h2 id="bio-title" className="mono">Biography</h2>
        </div>
        <div className="bio">
          {biography.map((p, i) => <p key={i} className={i === 0 ? 'bio__lead serif' : 'bio__p'}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}
