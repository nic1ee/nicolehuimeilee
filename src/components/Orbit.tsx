import { useRef } from 'react';
import { gsap, reducedMotion, MQ } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';

/** Project 03 — the horizon bends into an orbit; the ISS hands off to commercial stations. */
const LINE = 'M40 220 C40 220 147 220 280 220 C413 220 520 220 520 220 C520 220 413 220 280 220 C147 220 40 220 40 220 Z';
const ELLIPSE = 'M40 220 C40 137 147 70 280 70 C413 70 520 137 520 220 C520 303 413 370 280 370 C147 370 40 303 40 220 Z';
const on = (deg: number) => {
  const a = (deg * Math.PI) / 180;
  return { x: 280 + 240 * Math.cos(a), y: 220 + 150 * Math.sin(a) };
};
const CLD = [{ id: 'A', deg: -50 }, { id: 'B', deg: 25 }, { id: 'C', deg: 115 }].map((c) => ({ ...c, ...on(c.deg) }));
const QUESTIONS = ['Who carries the risk?', 'Who sets the rules?', 'What does the public keep?'];

export default function Orbit() {
  const ref = useRef<HTMLElement>(null);
  const reduced = reducedMotion();

  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add({ desk: MQ.desktop, mob: MQ.mobile }, (c) => {
      const desk = c.conditions?.desk;
      const iss = q('.iss')[0] as SVGGElement;
      const issPos = { deg: 180 };
      const placeIss = () => { const p = on(issPos.deg); iss.setAttribute('transform', `translate(${p.x} ${p.y})`); };
      placeIss();
      const conns = q('.conn') as SVGPathElement[];
      conns.forEach((c) => { const l = c.getTotalLength(); gsap.set(c, { strokeDasharray: `${l} ${l}`, strokeDashoffset: l }); });
      const earth = q('.earth')[0] as SVGCircleElement;
      const el = earth.getTotalLength();
      gsap.set(earth, { strokeDasharray: el, strokeDashoffset: el });

      const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        scrollTrigger: desk
          ? { trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 1.6}`, pin: q('.stage')[0], scrub: 0.6, anticipatePin: 1 }
          : { trigger: q('.orbit__fig')[0], start: 'top 75%', end: 'bottom 25%', scrub: 0.6 },
      });
      tl.fromTo(q('.orb'), { morphSVG: LINE }, { morphSVG: ELLIPSE, duration: 1.2 }, 0)
        .to(earth, { strokeDashoffset: 0, duration: 1 }, 0.3)
        .from(q('.earth-lab'), { opacity: 0, duration: 0.3 }, 1)
        .from(iss, { scale: 0, transformOrigin: '0 0', duration: 0.3 }, 1.0)
        .to(issPos, { deg: 250, duration: 1.6, onUpdate: placeIss }, 1.3)
        .to(q('.iss circle'), { attr: { r: 5 }, fill: 'var(--bone)', duration: 0.4 }, 2.6)
        .to(q('.iss-now'), { opacity: 0, duration: 0.2 }, 2.6)
        .fromTo(q('.iss-later'), { opacity: 0 }, { opacity: 1, duration: 0.3 }, 2.75)
        .from(q('.cld'), { scale: 0, transformOrigin: '50% 50%', duration: 0.35, stagger: 0.25, ease: 'expo.out' }, 2.4)
        .to(conns, { strokeDashoffset: 0, duration: 0.6, stagger: 0.3 }, 3.4)
        .from(q('.orbit__q li'), { clipPath: 'inset(0 100% 0 0)', duration: 0.5, stagger: 0.3, ease: 'expo.out' }, 3.5);
    });
  });

  const issAt = on(reduced ? 250 : 180);
  return (
    <section id="orbit" className="orbit" ref={ref} aria-labelledby="orbit-title">
      <div className="stage" style={reduced ? { height: 'auto', paddingBlock: 96 } : undefined}>
        <div className="orbit__row">
          <figure className="orbit__fig" data-cursor="cross">
            <svg viewBox="0 0 560 440" role="img" aria-label="An orbit around Earth: the ISS retires while three commercial stations connect into a network">
              <path className="ln dash orb" d={reduced ? ELLIPSE : LINE} />
              <circle className="ln earth" cx="280" cy="220" r="86" fill="none" />
              <text className="q earth-lab" x="280" y="224" textAnchor="middle">EARTH</text>
              <path className="conn" d={`M${CLD[0].x} ${CLD[0].y} L${CLD[1].x} ${CLD[1].y}`} />
              <path className="conn" d={`M${CLD[1].x} ${CLD[1].y} L${CLD[2].x} ${CLD[2].y}`} />
              <path className="conn" d={`M${CLD[2].x} ${CLD[2].y} L${CLD[0].x} ${CLD[0].y}`} />
              {CLD.map((c) => (
                <g className="cld" key={c.id}>
                  <circle cx={c.x} cy={c.y} r="7" fill="var(--orange)" />
                  <text x={c.x + 14} y={c.y + 4}>CLD-{c.id}</text>
                </g>
              ))}
              <g className="iss" transform={`translate(${issAt.x} ${issAt.y})`}>
                <circle r="9" fill={reduced ? 'var(--bone)' : 'var(--ink)'} stroke="var(--ink)" strokeWidth="1.5" />
                {!reduced && <text x="-16" y="-16" textAnchor="end" className="iss-now">ISS</text>}
                <text x="-16" y="-16" textAnchor="end" className="iss-later" opacity={reduced ? 1 : 0}>ISS · retires ~2030</text>
              </g>
            </svg>
          </figure>
          <div className="orbit__txt">
            <p className="mono accent" style={{ margin: 0 }}>TA-03 · Space policy</p>
            <h2 id="orbit-title" className="orbit__title serif">After the Station</h2>
            <p className="body-copy" style={{ marginTop: 24 }}>
              The International Space Station is scheduled to retire around 2030, and NASA plans to become one customer
              among many on commercially owned stations. At The Aerospace Corporation’s Center for Space Policy and
              Strategy I’m building a framework for evaluating that transition.
            </p>
            <ol className="orbit__q mono" style={{ listStyle: 'none', margin: '28px 0 0', padding: 0, display: 'grid', gap: 10 }}>
              {QUESTIONS.map((qq, i) => (
                <li key={qq} style={{ display: 'flex', gap: 14, borderTop: '1px solid var(--rule)', paddingTop: 10 }}>
                  <span className="accent">Q{i + 1}</span><span>{qq}</span>
                </li>
              ))}
            </ol>
            <dl className="spec" style={{ marginTop: 32 }}>
              <dt className="mono">Where</dt><dd>Center for Space Policy and Strategy, The Aerospace Corporation</dd>
              <dt className="mono">Role</dt><dd>Research Fellow · 2026 –</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
