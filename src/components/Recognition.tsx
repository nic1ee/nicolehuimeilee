import { useRef } from 'react';
import { gsap } from '../motion/setup';
import { useMotion } from '../motion/useMotion';
import { recognition, roles, scholarships } from '../content';

/** Stillness. Typography only; one hairline draws under the heading. */
export default function Recognition() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, root) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.querySelector('.rule'), {
        scaleX: 0, duration: 1.6, ease: 'expo.inOut',
        scrollTrigger: { trigger: root, start: 'top 70%' },
      });
    });
  });

  return (
    <section id="recognition" className="recog" ref={ref} aria-labelledby="recog-title">
      <div className="wrap recog__grid">
        <div className="recog__lab">
          <h2 id="recog-title" className="mono" style={{ margin: 0, fontWeight: 500 }}>07 — Recognition</h2>
          <span className="rule" aria-hidden="true" />
        </div>
        <div style={{ flex: '1 1 640px', minWidth: 0 }}>
          <ul className="recog__list">
            {recognition.map((r) => <li key={r}>{r}</li>)}
            {roles.map((r) => {
              const [title, ...rest] = r.split(', ');
              return <li key={r}><em>{title}</em>, {rest.join(', ')}</li>;
            })}
          </ul>
          <p className="recog__small mono">Also: {scholarships.join(' · ')}</p>
        </div>
      </div>
    </section>
  );
}
