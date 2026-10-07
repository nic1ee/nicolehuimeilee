import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, reducedMotion } from '../motion/setup';
import { archive } from '../content';
import { go } from './Header';

/**
 * Archive index — browsed like an exhibition catalogue. The active row's number rolls into
 * the large sticky numeral, its plate opens in the preview frame, and a hairline leader
 * connects title to image.
 */
export default function Archive() {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null); // touch / narrow: tap to expand
  const wrap = useRef<HTMLDivElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const leader = useRef<SVGLineElement>(null);
  const wide = useRef(false);
  const [isWide, setWide] = useState(false);

  useEffect(() => {
    const m = window.matchMedia('(min-width: 1100px)');
    const set = () => { wide.current = m.matches; setWide(m.matches); };
    set(); m.addEventListener('change', set);
    return () => m.removeEventListener('change', set);
  }, []);

  // Shutter the preview plate on every change.
  useLayoutEffect(() => {
    if (!plate.current) return;
    if (reducedMotion()) { gsap.set(plate.current, { clipPath: 'inset(0 0 0% 0)' }); return; }
    gsap.fromTo(plate.current, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.75, ease: 'expo.out', overwrite: true });
  }, [active]);

  // Leader line from the active title's end to the preview frame; follows scroll.
  useEffect(() => {
    const ln = leader.current, w = wrap.current;
    if (!ln || !w) return;
    let drawn = -1;
    const place = () => {
      if (!wide.current) return;
      const t = w.querySelector<HTMLElement>(`.arow[data-i='${active}'] .arow__t`);
      const p = plate.current;
      if (!t || !p) return;
      const wr = w.getBoundingClientRect(), tr = t.getBoundingClientRect(), pr = p.getBoundingClientRect();
      const range = document.createRange(); range.selectNodeContents(t);
      const textR = range.getBoundingClientRect();
      const x1 = textR.right - wr.left + 16, y1 = tr.top - wr.top + tr.height / 2;
      const x2 = pr.left - wr.left - 8, y2 = Math.min(Math.max(y1, pr.top - wr.top + 12), pr.bottom - wr.top - 12);
      ln.setAttribute('x1', String(x1)); ln.setAttribute('y1', String(y1));
      ln.setAttribute('x2', String(x2)); ln.setAttribute('y2', String(y2));
      if (drawn !== active) {
        drawn = active;
        const len = Math.hypot(x2 - x1, y2 - y1);
        if (reducedMotion()) gsap.set(ln, { strokeDasharray: 'none' });
        else gsap.fromTo(ln, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 0.7, ease: 'expo.out', delay: 0.1, overwrite: true });
      }
    };
    place();
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place);
    return () => { window.removeEventListener('scroll', place); window.removeEventListener('resize', place); };
  }, [active, isWide]);

  const item = archive[active];

  return (
    <section id="index" className="archive" aria-labelledby="index-title">
      <div className="wrap">
        <div className="sechead">
          <h2 id="index-title" className="mono">05 — Index of work</h2>
          <span className="mono muted">{archive.length} entries · 2022 → present</span>
        </div>
        <div className="archive__wrap" ref={wrap}>
          <svg className="leader" aria-hidden="true"><line ref={leader} /></svg>
          <div className="archive__grid">
            <div className="archive__num serif" aria-hidden="true">
              <div style={{ transform: `translateY(${-active * 100}%)`, transition: 'transform .8s cubic-bezier(.16,1,.3,1)' }}>
                {archive.map((a) => <span key={a.n}>{a.n}</span>)}
              </div>
            </div>
            <ul className="archive__list">
              {archive.map((a, i) => {
                const on = isWide ? active === i : open === i;
                return (
                  <li key={a.n} className={`arow${on ? ' on' : ''}`} data-i={i}
                    onPointerEnter={(e) => { if (e.pointerType === 'mouse') setActive(i); }}>
                    <button type="button" className="arow__btn" data-cursor="view"
                      aria-expanded={on}
                      onFocus={() => setActive(i)}
                      onClick={() => { setActive(i); setOpen(open === i ? null : i); }}>
                      <span className="arow__n mono">{a.n}</span>
                      <span className="arow__t">{a.title}</span>
                      <span className="arow__y mono">{a.year}</span>
                    </button>
                    <div className="arow__meta">
                      <div>
                        <span className="mono muted">{a.where} · {a.kind}</span>
                        <p>{a.note}{a.href && <> <a className="tlink accent" href={a.href} onClick={(e) => go(e, a.href!)}>Read the section →</a></>}</p>
                        <div className="plate"><span className="mono">[{a.image}]</span></div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
            <figure className="archive__prev" style={{ margin: 0 }} data-cursor="view">
              <div className="plate" ref={plate}><span className="mono">[{item.image}]</span></div>
              <figcaption className="mono muted">Fig. {item.n} — {item.where}</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
