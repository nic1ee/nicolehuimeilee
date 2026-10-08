import { useRef } from 'react';
import { gsap } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { biography } from '../content';

/** Biography — the words, set well. A hairline draws under the label; the text is still. */
export default function Bio() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(q('.sec__rule'), {
        scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'expo.inOut',
        scrollTrigger: { trigger: root, start: 'top 75%' },
      });
    });
  });

  return (
    <section id="bio" className="sec" ref={ref} aria-labelledby="bio-title">
      <div className="wrap sec__grid">
        <div className="sec__lab">
          <h2 id="bio-title" className="mono">Biography</h2>
          <span className="sec__rule" aria-hidden="true" />
        </div>
        <div className="bio">
          {biography.map((p, i) => <p key={i} className={i === 0 ? 'bio__lead serif' : 'bio__p'}>{p}</p>)}
        </div>
      </div>
    </section>
  );
}
