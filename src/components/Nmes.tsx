import { useRef } from 'react';
import { gsap } from '../motion/setup';
import { useMotion } from '../motion/useMotion';

/** Project 01 body — a reading section. Only the waveform draws, once. */
export default function Nmes() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm, root) => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const path = root.querySelector<SVGPathElement>('.wavefig path');
      if (!path) return;
      const len = path.getTotalLength();
      gsap.fromTo(path, { strokeDasharray: len, strokeDashoffset: len }, {
        strokeDashoffset: 0, duration: 2.2, ease: 'power2.inOut',
        scrollTrigger: { trigger: path, start: 'top 80%' },
      });
    });
  });

  let d = 'M0 60 H40';
  for (let x = 40; x < 560; x += 104) d += ` V18 H${x + 12} V102 H${x + 24} V60 H${x + 104}`;

  return (
    <section id="ta01" className="ta01" ref={ref} aria-labelledby="ta01-title">
      <h2 id="ta01-title" className="sr">Wearable NMES countermeasure — details</h2>
      <div className="wrap cols">
        <div style={{ flex: '1 1 520px' }}>
          <p className="body-copy">
            Without gravity, muscle and bone quietly waste away. Treadmills and resistance machines slow the
            loss, but they are large and they consume crew time. I’m developing wearable neuromuscular
            electrical stimulation as a supplemental countermeasure: small electrical pulses that make the
            muscles work during the hours astronauts are doing everything else.
          </p>
          <p className="body-copy" style={{ marginTop: 20 }}>
            The work spans wearable electronics, a human-subjects study on the ground, and integration with
            the Gravity Loading Countermeasure Skinsuit for reduced-gravity testing.
          </p>
        </div>
        <div style={{ flex: '1 1 460px' }}>
          <figure className="wavefig" style={{ margin: 0 }} data-cursor="cross">
            <svg viewBox="0 0 560 120" role="img" aria-label="Biphasic stimulation waveform">
              <line x1="0" y1="60" x2="560" y2="60" stroke="var(--rule)" />
              <path d={d} />
            </svg>
            <figcaption className="figcap mono"><span>CH-1 · Biphasic pulse train</span><span>[Parameters — TBD]</span></figcaption>
          </figure>
          <dl className="spec" style={{ marginTop: 40 }}>
            <dt className="mono">Type</dt><dd>Wearable electronics · human-subjects study</dd>
            <dt className="mono">Environment</dt><dd>Long-duration microgravity</dd>
            <dt className="mono">Lab</dt><dd>MIT Human Systems Lab · Prof. Dava Newman</dd>
            <dt className="mono">Status</dt><dd>In development · 2025 –</dd>
          </dl>
        </div>
      </div>
    </section>
  );
}
