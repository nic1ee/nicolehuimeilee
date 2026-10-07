import { useRef } from 'react';
import { gsap, MQ, range } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { bands, flightPlan } from '../content';

/**
 * ★ Signature 3 — "Flight plan".
 * Career as a filed flight plan: three flight levels, waypoint idents with real coordinates,
 * a route string. Vertical scroll becomes horizontal travel under a fixed pen that draws the
 * route; each waypoint resolves as the pen reaches it and is cleared in the route string.
 * Then the camera pulls back until the whole route is visible at once.
 */
const VW = 3000, VH = 1000;
const BAND_Y = [740, 520, 300]; // Human, Machine, Market & policy
const X0 = 300, X1 = 2700;
const WP = flightPlan.map((w, i) => ({ ...w, x: X0 + (i * (X1 - X0)) / (flightPlan.length - 1), y: BAND_Y[w.band] }));
const START = { x: 120, y: WP[0].y };
const END = { x: 2880, y: WP[WP.length - 1].y };

function routePath() {
  const pts = [START, ...WP, END];
  let d = `M${pts[0].x} ${pts[0].y}`;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i];
    const h = (b.x - a.x) / 2;
    d += ` C${a.x + h} ${a.y} ${b.x - h} ${b.y} ${b.x} ${b.y}`;
  }
  return d;
}
const ROUTE = routePath();

export default function FlightPlan() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);

    mm.add(MQ.desktop, () => {
      const stage = q('.stage')[0] as HTMLElement;
      const doc = q('.plan__doc')[0] as HTMLElement;
      const route = q('.route')[0] as SVGPathElement;
      const wps = q('.wp') as SVGGElement[];
      const carries = q('.carry') as SVGTextElement[];
      const tokens = q('.plan__route [data-k]') as HTMLElement[];
      const pen = q('.plan__pen')[0] as HTMLElement;

      const L = route.getTotalLength();
      const N = 1200;
      const samples = Array.from({ length: N + 1 }, (_, i) => ({ l: (L * i) / N, x: route.getPointAtLength((L * i) / N).x }));
      const lenAtX = (x: number) => {
        if (x <= samples[0].x) return 0;
        let lo = 0, hi = N;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (samples[mid].x < x) lo = mid; else hi = mid; }
        return samples[lo].l + (samples[hi].l - samples[lo].l) * range(x, samples[lo].x, samples[hi].x);
      };
      gsap.set(route, { strokeDasharray: L, strokeDashoffset: L });

      const scale = () => stage.clientHeight / VH;          // px per viewBox unit
      const xFor = (vx: number) => window.innerWidth * 0.5 - vx * scale();

      const render = () => {
        const s = scale();
        const docX = Number(gsap.getProperty(doc, 'x'));
        const docS = Number(gsap.getProperty(doc, 'scale'));
        const penVx = (window.innerWidth * 0.5 - docX) / (s * docS);
        const zoomed = docS < 0.98;
        const reach = zoomed ? END.x : penVx;
        gsap.set(route, { strokeDashoffset: L - lenAtX(reach) });
        WP.forEach((w, i) => {
          const on = reach >= w.x - 2;
          wps[i].classList.toggle('on', on);
          wps[i].style.opacity = on ? '1' : '0.28';
          if (carries[i]) carries[i].style.opacity = reach >= (WP[i - 1]?.x ?? 0) + (w.x - (WP[i - 1]?.x ?? 0)) * 0.45 ? '1' : '0';
          tokens[i].style.opacity = on ? '1' : '0.25';
        });
      };

      gsap.set(doc, { x: () => xFor(START.x), y: 0, scale: 1 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 4}`,
          pin: stage, scrub: 0.7, anticipatePin: 1, invalidateOnRefresh: true,
        },
        onUpdate: render,
      });
      tl.fromTo(pen, { opacity: 0 }, { opacity: 1, duration: 0.15 }, 0)
        .fromTo(doc, { x: () => xFor(START.x) }, { x: () => xFor(END.x), duration: 8 }, 0)
        .to(pen, { opacity: 0, duration: 0.3 }, 8.1)
        .to(doc, {
          scale: () => Math.min((window.innerWidth * 0.86) / (VW * scale()), 1),
          x: () => (window.innerWidth - VW * scale() * Math.min((window.innerWidth * 0.86) / (VW * scale()), 1)) / 2,
          y: () => {
            const f = Math.min((window.innerWidth * 0.86) / (VW * scale()), 1);
            return (stage.clientHeight - stage.clientHeight * f) / 2 + 40;
          },
          duration: 2, ease: 'power3.inOut',
        }, 8.2)
        .to({}, { duration: 0.8 });
      render();
    });

    mm.add(MQ.mobile, () => {
      const fill = q('.mplan__line i')[0];
      gsap.fromTo(fill, { scaleY: 0 }, {
        scaleY: 1, ease: 'none',
        scrollTrigger: { trigger: q('.mplan')[0], start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
      });
      (q('.mplan li') as HTMLElement[]).forEach((li) => {
        gsap.from(li.querySelectorAll('.id, .mono, .carry'), {
          clipPath: 'inset(0 100% 0 0)', duration: 0.9, ease: 'expo.out', stagger: 0.08,
          scrollTrigger: { trigger: li, start: 'top 72%' },
        });
      });
    });
  });

  return (
    <section id="trajectory" className="plan" ref={ref} aria-labelledby="plan-title">
      <div className="stage">
        <div className="plan__head">
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'baseline' }}>
            <h2 id="plan-title" className="mono" style={{ margin: 0, fontWeight: 500 }}>06 — Trajectory · Flight plan</h2>
            <span className="mono muted">N. Lee · 2020 → present · not to scale</span>
          </div>
          <p className="plan__route" aria-label={`Route: ${flightPlan.map((w) => w.id).join(' direct ')}`}>
            {flightPlan.map((w, i) => (
              <span key={w.id} data-k={i}><b>{w.id}</b>{i < flightPlan.length - 1 && <span className="dct"> DCT </span>}</span>
            ))}
          </p>
        </div>
        <div className="plan__doc" aria-hidden="true">
          <svg viewBox={`0 0 ${VW} ${VH}`} style={{ width: 'calc(100svh * 3)' }} data-cursor="cross">
            {BAND_Y.map((y, i) => (
              <g key={y}>
                <line className="band" x1="-3000" y1={y} x2="6000" y2={y} />
                {[40, 1200, 2400].map((x) => <text key={x} className="bandlab" x={x} y={y - 12}>FL{i + 1} · {bands[i].toUpperCase()}</text>)}
              </g>
            ))}
            <path className="route-ghost" d={ROUTE} />
            <path className="route" d={ROUTE} />
            {WP.map((w, i) => {
              const prev = WP[i - 1];
              return (
                <g key={w.id}>
                  {prev && w.carry && (
                    <text className="carry" x={(prev.x + w.x) / 2} y={Math.min(prev.y, w.y) - 92} textAnchor="middle" style={{ opacity: 0, transition: 'opacity .6s' }}>{w.carry}</text>
                  )}
                  <g className="wp" style={{ opacity: 0.28, transition: 'opacity .5s' }}>
                    <line className="x" x1={w.x - 18} y1={w.y} x2={w.x + 18} y2={w.y} />
                    <line className="x" x1={w.x} y1={w.y - 18} x2={w.x} y2={w.y + 18} />
                    <circle cx={w.x} cy={w.y} r="8" />
                    <text className="id" x={w.x + 18} y={w.y - 20}>{w.id}</text>
                    <text x={w.x + 18} y={w.y + 34}>{w.org.toUpperCase()}</text>
                    <text className="sub" x={w.x + 18} y={w.y + 52}>{w.role}</text>
                    <text className="sub" x={w.x + 18} y={w.y + 70}>{w.coord} · {w.year}</text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="plan__pen" aria-hidden="true" />
      </div>

      {/* Narrow screens and reduced motion: the chart turns 90° and draws downward. */}
      <div className="plan__mobile wrap">
        <div className="sechead">
          <h2 className="mono" style={{ fontWeight: 500 }}>06 — Trajectory · Flight plan</h2>
          <span className="mono muted">2020 → present</span>
        </div>
        <div className="mplan">
          <div className="mplan__line" aria-hidden="true"><i /></div>
          <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {flightPlan.map((w) => (
            <li key={w.id}>
              {w.carry && <span className="carry">{w.carry}</span>}
              <div className="id">{w.id}</div>
              <div className="mono" style={{ marginTop: 6 }}>{w.org} · {w.year}</div>
              <div className="mono muted">{w.role} · {w.coord} · FL{w.band + 1} {bands[w.band]}</div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
