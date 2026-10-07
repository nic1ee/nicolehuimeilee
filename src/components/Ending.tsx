import { useRef, useState } from 'react';
import { gsap, scrollToTarget } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { gauge } from '../motion/gauge';
import { person } from '../content';

/**
 * Ending — composure. Metadata from every chapter lies scattered like notes on a working
 * drawing, then gathers into four lines; the thread draws one last time under the name.
 */
const SCATTER: { t: string; x: number; y: number; to: number }[] = [
  { t: 'TA-01 · Biomedical hardware', x: 6, y: 16, to: 0 },
  { t: 'Section A–A', x: 70, y: 12, to: 0 },
  { t: 'g 0.00 · zero-g parabola', x: 58, y: 30, to: 1 },
  { t: '42.3601° N · 71.0942° W', x: 12, y: 74, to: 1 },
  { t: 'CLD-B', x: 84, y: 54, to: 2 },
  { t: 'Q2 · Who sets the rules?', x: 40, y: 86, to: 2 },
  { t: 'Route: UAZ … CSPS', x: 76, y: 80, to: 3 },
  { t: 'Rev. 2026.10', x: 30, y: 8, to: 3 },
];

export default function Ending() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const emailRef = useRef<HTMLSpanElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cells = q('.end__card > *') as HTMLElement[];
      const notes = q('.end__scatter span') as HTMLElement[];
      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 1.2}`, pin: q('.stage')[0], scrub: 0.6, anticipatePin: 1, invalidateOnRefresh: true },
      });
      tl.from(q('.end__q .line-mask > span'), { yPercent: 105, duration: 0.6, stagger: 0.1, ease: 'expo.out' }, 0);
      notes.forEach((n, i) => {
        const cell = cells[SCATTER[i].to];
        tl.to(n, {
          x: () => cell.offsetLeft - n.offsetLeft,
          y: () => cell.offsetTop + 18 - n.offsetTop,
          duration: 1, ease: 'power3.inOut',
        }, 0.5 + i * 0.04)
          .to(n, { opacity: 0, duration: 0.2 }, 1.35 + i * 0.04);
      });
      tl.from(cells, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, stagger: 0.08, ease: 'expo.out' }, 1.4)
        .from(q('.end__base i'), { scaleX: 0, duration: 0.9, ease: 'expo.inOut' }, 1.6);
    });
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      const r = document.createRange();
      if (emailRef.current) { r.selectNodeContents(emailRef.current); const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r); }
    }
  };

  const toTop = () => {
    const from = gauge.get();
    scrollToTarget(0, 2.6);
    gsap.fromTo({ g: from }, { g: from }, { g: 1, duration: 2.4, ease: 'power2.inOut', onUpdate() { gauge.set(this.targets()[0].g); } });
  };

  return (
    <section id="contact" className="end" ref={ref} aria-labelledby="end-title">
      <div className="stage wrap">
        <div className="end__scatter mono" aria-hidden="true">
          {SCATTER.map((s) => <span key={s.t} style={{ left: `${s.x}%`, top: `${s.y}%` }}>{s.t}</span>)}
        </div>
        <p className="mono muted" style={{ margin: '0 0 20px' }}>08 — Contact</p>
        <h2 id="end-title" className="end__q serif" data-cursor="hide">
          <span className="line-mask"><span>Building what</span></span>
          <span className="line-mask"><span><em>comes next?</em></span></span>
        </h2>
        <div className="end__card">
          <div>
            <span className="lab mono">Name</span>
            <span className="val">{person.fullName}</span>
          </div>
          <div>
            <span className="lab mono">Based</span>
            <span className="val">{person.place}</span>
          </div>
          <div>
            <span className="lab mono">Email</span>
            <a className="val" href={`mailto:${person.email}`} data-cursor="link">
              <span className="email" ref={emailRef}><span>{person.email}</span><span aria-hidden="true">{person.email}</span></span>
            </a>
            <div>
              <button type="button" className="copy mono" onClick={copy} data-done={copied}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 6.5 L4.5 9.5 L10.5 2.5" /></svg>
                <span aria-live="polite">{copied ? 'Copied' : 'Copy address'}</span>
              </button>
            </div>
          </div>
          <div>
            <span className="lab mono">Documents</span>
            <a className="val cvlink" href={person.cv} target="_blank" rel="noopener">
              <span className="tlink">CV</span><span className="tag mono">PDF ↗</span>
            </a>
            <div style={{ marginTop: 10 }}>
              <a className="tlink mono" href={person.linkedin} target="_blank" rel="noopener">LinkedIn ↗</a>
            </div>
          </div>
        </div>
        <div className="end__base" aria-hidden="true"><i /></div>
      </div>
      <div className="wrap foot mono">
        <span>{person.fullName} · MIT AeroAstro · {person.place}</span>
        <button type="button" onClick={toTop} className="tlink">Return to 1 G ↑</button>
        <span>Rev. 2026.10</span>
      </div>
    </section>
  );
}
