import { useRef, useState } from 'react';
import { gsap } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { sectionLine, riseRows } from '../motion/reveals';
import { person } from '../content';
import { go } from './Header';

/** CV and contact as three index rows. */
export default function Contact() {
  const ref = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const addr = useRef<HTMLSpanElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      sectionLine(root);
      riseRows(root, '.row');
      // Closing: the footer's name settles in last, on a short orange baseline.
      gsap.from(q('.foot__base'), { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'expo.inOut', scrollTrigger: { trigger: q('.foot')[0], start: 'top 95%' } });
    });
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      if (!addr.current) return;
      const r = document.createRange(); r.selectNodeContents(addr.current);
      const s = window.getSelection(); s?.removeAllRanges(); s?.addRange(r);
    }
  };

  return (
    <section id="contact" className="sec" ref={ref} aria-labelledby="contact-title">
      <div className="wrap"><div className="sec__line" aria-hidden="true"><i /><b /></div></div>
      <div className="wrap sec__grid">
        <div className="sec__lab">
          <h2 id="contact-title" className="mono">CV &amp; Contact</h2>
        </div>
        <ul className="rows">
          <li className="row">
            <a className="row__a" href={person.cv} target="_blank" rel="noopener">
              <span className="row__k mono muted">CV</span>
              <span className="row__v serif"><span className="roll"><span>Curriculum vitae</span><span aria-hidden="true">Curriculum vitae</span></span></span>
              <span className="row__x mono">PDF ↗</span>
            </a>
          </li>
          <li className="row">
            <div className="row__a">
              <span className="row__k mono muted">Email</span>
              <a className="row__v serif" href={`mailto:${person.email}`}>
                <span className="roll" ref={addr}><span>{person.email}</span><span aria-hidden="true">{person.email}</span></span>
              </a>
              <button type="button" className="row__x mono copy" onClick={copy} data-done={copied}>
                <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 6.5 L4.5 9.5 L10.5 2.5" /></svg>
                <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </li>
          <li className="row">
            <a className="row__a" href={person.linkedin} target="_blank" rel="noopener">
              <span className="row__k mono muted">LinkedIn</span>
              <span className="row__v serif"><span className="roll"><span>nicolehuimeilee</span><span aria-hidden="true">nicolehuimeilee</span></span></span>
              <span className="row__x mono">↗</span>
            </a>
          </li>
        </ul>
      </div>
      <footer className="wrap foot mono muted">
        <span className="foot__base" aria-hidden="true" />
        <span>{person.name} · {person.place}</span>
        <a className="tlink" href="#top" onClick={(e) => go(e, '#top')}>Back to top ↑</a>
      </footer>
    </section>
  );
}
