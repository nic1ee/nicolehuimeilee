import { useRef } from 'react';
import { gsap, ScrollTrigger, reducedMotion, range, smooth } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { gauge } from '../motion/gauge';

/**
 * ★ Signature 2 — "Parabolic".
 * The rule at the end of Project 01 thickens into the black field. A reduced-gravity flight
 * profile draws across it (Martian, lunar, then zero-g parabolas) and the headline's letters
 * obey the current g through a spring-damper simulation: heavy at 1.8 G, lifting at 0.38 and
 * 0.16, drifting free at 0.00, landing on pull-out. Exit: the ivory ground rises at the horizon.
 */
const PROFILE =
  'M0 200 L110 200 C140 200 155 185 170 165 Q250 70 330 165 C345 185 365 192 380 192 ' +
  'C395 192 415 185 430 165 Q510 40 590 165 C605 185 625 192 640 192 C655 192 675 185 690 165 ' +
  'Q810 0 930 165 C950 190 970 200 1010 200 L1200 200';

// [x start, x end, g, label]
const SEGS: [number, number, number, string][] = [
  [0, 110, 1.0, 'Level flight'],
  [110, 170, 1.8, 'Pull-up'],
  [170, 330, 0.38, 'Martian parabola'],
  [330, 430, 1.8, 'Pull-out · pull-up'],
  [430, 590, 0.16, 'Lunar parabola'],
  [590, 690, 1.8, 'Pull-out · pull-up'],
  [690, 930, 0.0, 'Zero-g parabola'],
  [930, 1010, 1.8, 'Pull-out'],
  [1010, 1200, 1.0, 'Level flight'],
];

function gAt(x: number): number {
  const B = 9; // blend half-width, in profile units
  for (let i = 0; i < SEGS.length; i++) {
    const [a, b, g] = SEGS[i];
    if (x < b || i === SEGS.length - 1) {
      if (i > 0 && x < a + B) return gsap.utils.interpolate(SEGS[i - 1][2], g, smooth(range(x, a - B, a + B)));
      if (i < SEGS.length - 1 && x > b - B) return gsap.utils.interpolate(g, SEGS[i + 1][2], smooth(range(x, b - B, b + B)));
      return g;
    }
  }
  return 1;
}
const phaseAt = (x: number) => (SEGS.find(([, b]) => x < b) ?? SEGS[SEGS.length - 1])[3];

const TITLE = ['The', 'skinsuit,', 'at', 'every', 'gravity'];

export default function Flight() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);

    mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
      const stage = q('.stage')[0] as HTMLElement;
      const path = q('.profile .drawn')[0] as SVGPathElement;
      const clipRect = q('#drawclip rect')[0] as SVGRectElement;
      const marker = q('.profile .marker')[0] as SVGRectElement;
      const labels = q('.profile text[data-x]') as SVGTextElement[];
      const phase = q('.field__phase')[0] as HTMLElement;
      const letters = q('.field__title .gl') as HTMLElement[];

      // Sample the profile once: y for any x.
      const N = 900;
      const len = path.getTotalLength();
      const pts = Array.from({ length: N + 1 }, (_, i) => path.getPointAtLength((len * i) / N));
      const yAt = (x: number) => {
        let lo = 0, hi = N;
        while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (pts[mid].x < x) lo = mid; else hi = mid; }
        const a = pts[lo], b = pts[hi];
        return a.y + (b.y - a.y) * range(x, a.x, b.x || a.x + 1);
      };

      // ---- physics ----
      const seeds = letters.map((_, i) => [Math.sin(i * 12.9898) * 0.5 + 0.5, Math.sin(i * 78.233) * 0.5 + 0.5, Math.sin(i * 39.425) * 0.5 + 0.5]);
      const P = letters.map(() => ({ y: 0, vy: 0, x: 0, vx: 0, r: 0, vr: 0 }));
      let gPrev = 1, time = 0;
      const step = () => {
        const g = gauge.get();
        const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 30);
        time += dt;
        const drop = Math.max(0, gPrev - g);
        gPrev = g;
        const k = 170 * g + 1.6;               // weight holds each letter to its baseline; a faint tether at 0 G
        const c = 2 * Math.sqrt(k) * (g < 0.05 ? 0.12 : 0.82);
        const restY = (g - 1) * 3.5;           // heavier at 1.8 G, sits lower
        P.forEach((p, i) => {
          const [s1, s2, s3] = seeds[i];
          if (drop > 0) {                       // gravity released: each letter gets its own small push
            p.vy -= drop * (38 + 46 * s1);
            p.vx += drop * (s2 - 0.5) * 18;
            p.vr += drop * (s3 - 0.5) * 26;
          }
          let ay = -k * (p.y - restY) - c * p.vy;
          let ax = -k * p.x - c * p.vx;
          let ar = -k * p.r - c * p.vr;
          if (g < 0.05) {                       // free-fall drift: slow, incommensurate currents
            ay += Math.sin(time * 0.6 + i * 1.7) * 2.2;
            ax += Math.cos(time * 0.45 + i * 2.3) * 0.8;
            ar += Math.sin(time * 0.5 + i) * 1.6;
          }
          p.vy += ay * dt; p.y += p.vy * dt;
          p.vx += ax * dt; p.x += p.vx * dt;
          p.vr += ar * dt; p.r += p.vr * dt;
          p.y = gsap.utils.clamp(-30, 16, p.y);
          p.x = gsap.utils.clamp(-10, 10, p.x);
          p.r = gsap.utils.clamp(-16, 16, p.r);
          const squash = 1 - Math.max(0, g - 1) * 0.045 + gsap.utils.clamp(-0.05, 0.05, -p.vy * 0.0007);
          gsap.set(letters[i], { y: p.y, x: p.x, rotation: p.r, scaleY: squash, scaleX: 2 - squash });
        });
      };
      let running = false;
      const run = (on: boolean) => {
        if (on && !running) { gsap.ticker.add(step); running = true; }
        if (!on && running) { gsap.ticker.remove(step); running = false; }
      };
      ctx.add(() => () => run(false));

      // ---- choreography ----
      const state = { x: 0 };
      let lastPhase = '';
      const renderProfile = () => {
        const x = state.x;
        clipRect.setAttribute('width', String(x));
        marker.setAttribute('x', String(x - 4));
        marker.setAttribute('y', String(yAt(x) - 4));
        const g = gAt(x);
        gauge.set(g);
        const ph = x <= 0 ? '' : phaseAt(x);
        if (ph !== lastPhase) { phase.textContent = ph; lastPhase = ph; }
        labels.forEach((t) => t.classList.toggle('on', x >= Number(t.dataset.x)));
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 4.2}`,
          pin: stage, scrub: 0.6, anticipatePin: 1,
          onToggle: (s) => { run(s.isActive); if (!s.isActive) document.documentElement.removeAttribute('data-night'); },
          onUpdate: (s) => {
            const night = s.progress > 0.07 && s.progress < 0.93;
            document.documentElement.toggleAttribute('data-night', night);
          },
          onLeave: () => gauge.set(1),
          onLeaveBack: () => gauge.set(1),
        },
      });

      tl.to(q('.field'), { scaleY: 1, duration: 1.2, ease: 'power3.inOut' }, 0)
        .set(q('.field__in'), { opacity: 1 }, 0.95)
        .from(q('.field__head .mono'), { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.5em', duration: 0.6, ease: 'expo.out' }, 1.0)
        .from(q('.field__title .word'), { clipPath: 'inset(100% 0 0 0)', yPercent: 30, duration: 0.7, stagger: 0.06, ease: 'expo.out' }, 1.05)
        .from(q('.field__desc'), { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.out' }, 1.3)
        .from(q('.field__read'), { clipPath: 'inset(0 0 0 100%)', duration: 0.6, ease: 'expo.out' }, 1.2)
        .from(q('.profile .ghost, .profile .lvl'), { opacity: 0, duration: 0.4 }, 1.3)
        .to(state, { x: 1200, duration: 7.4, onUpdate: renderProfile }, 1.6)
        .set(q('.field__title .word'), { clipPath: 'none' }, 1.85)
        .fromTo(q('.horizon'), { yPercent: 100 }, { yPercent: 0, duration: 1.0, ease: 'power3.inOut' }, 9.0);

      renderProfile();
      ScrollTrigger.addEventListener('refresh', renderProfile);
      ctx.add(() => () => ScrollTrigger.removeEventListener('refresh', renderProfile));
    });
  });

  const reduced = reducedMotion();

  return (
    <section id="flight" className="flight" ref={ref} aria-labelledby="flight-title">
      <div className="stage" style={reduced ? { height: 'auto', background: 'var(--night)' } : undefined}>
        <div className="field" style={reduced ? { position: 'relative', top: 0, margin: 0, height: 'auto', minHeight: '100svh', transform: 'none' } : undefined}>
          <div className="field__in" style={reduced ? { position: 'relative', minHeight: '100svh' } : undefined}>
            <div className="field__head">
              <p className="mono" style={{ margin: 0, color: 'var(--orange)' }}>TA-02 · Spacesuit systems · Reduced-gravity flight</p>
              <h2 id="flight-title" className="field__title serif" aria-label="The skinsuit, at every gravity">
                {TITLE.map((w, wi) => (
                  <span className="word" key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap', fontStyle: wi === 4 ? 'italic' : undefined }} aria-hidden="true">
                    {w.split('').map((ch, ci) => <span className="gl" key={ci}>{ch}</span>)}
                    {wi < TITLE.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </h2>
              <p className="field__desc">
                The Gravity Loading Countermeasure Skinsuit recreates the head-to-foot load of standing on Earth.
                I’m integrating muscle stimulation into it and taking the combined system toward parabolic flight,
                where a single sortie cycles through Martian, lunar and zero gravity in about twenty-second windows.
              </p>
            </div>
            <div className="field__read" aria-live="off">
              <div className="field__g"><span data-g>{reduced ? '0.00' : '1.00'}</span><small>G</small></div>
              <div className="field__phase mono">{reduced ? 'Zero-g parabola' : ''}</div>
            </div>
            <div className="profile" data-cursor="cross">
              <svg viewBox="-10 -10 1220 260" role="img" aria-label="Flight profile: level flight at 1 G, then Martian (0.38 G), lunar (0.16 G) and zero-g parabolas, each entered and left through 1.8 G pull-ups and pull-outs">
                <defs><clipPath id="drawclip"><rect x="-10" y="-20" width={reduced ? 1220 : 0} height="300" /></clipPath></defs>
                <line className="lvl" x1="0" y1="200" x2="1200" y2="200" strokeDasharray="1 6" />
                <path className="ghost" d={PROFILE} />
                <path className="drawn" d={PROFILE} clipPath="url(#drawclip)" />
                <text x="40" y="226" data-x="20">1.00 G</text>
                <text className="pull" x="118" y="230" data-x="120">1.8</text>
                <text x="214" y="148" data-x="200">MARS 0.38</text>
                <text className="pull" x="368" y="216" data-x="340">1.8</text>
                <text x="470" y="134" data-x="460">MOON 0.16</text>
                <text className="pull" x="628" y="216" data-x="600">1.8</text>
                <text x="752" y="124" data-x="720">ZERO-G 0.00</text>
                <text className="pull" x="948" y="226" data-x="940">1.8</text>
                <text x="1100" y="226" data-x="1060">1.00 G</text>
                <rect className="marker" width="8" height="8" x={reduced ? 806 : -4} y={reduced ? 78 : 196} />
              </svg>
            </div>
          </div>
        </div>
        {!reduced && <div className="horizon" aria-hidden="true" />}
      </div>
    </section>
  );
}
