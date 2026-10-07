import { useRef } from 'react';
import { gsap, MQ, reducedMotion, range, ScrollTrigger } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { mission } from '../content';

/**
 * ★ Signature 1 — "Section A–A".
 * The mission sentence drops every word but "body" under gravity. Stimulation pulses run
 * along a baseline from both sides; each arrival contracts the word like a muscle (shorter,
 * thicker, damped recovery). The baseline then rises to become a section-cut line and the
 * word parts along it, opening Project 01 between its halves.
 */
const LETTERS = ['b', 'o', 'd', 'y'];
const PULSES = 5;
// Timeline units. The first 0.8 is a still hold so the sentence is read before anything moves.
const T = { drawA: 3.2, drawB: 4.2, pulseA: 4.3, pulseGap: 0.7, travel: 0.55, cutPrep: 8.2, cut: 9.0, end: 10.8 };

function ChapterHeader() {
  return (
    <div className="reveal__row">
      <div className="reveal__txt">
        <p className="mono accent" style={{ margin: 0 }}>Section A–A · TA-01 · Biomedical hardware</p>
        <h2 className="reveal__title serif">Wearable NMES countermeasure</h2>
        <p className="body-copy" style={{ marginTop: 24 }}>
          Exercise that rides along in the suit: electrical stimulation that makes muscles work when gravity no longer asks them to.
        </p>
      </div>
      <figure className="reveal__fig" data-cursor="view">
        <div className="plate" style={{ aspectRatio: '4 / 5' }}><span className="mono">[NMES electrode test — macro 4:5, B&amp;W]</span></div>
        <figcaption className="figcap mono"><span>Fig. 01 — Electrode placement</span><span>Quadriceps</span></figcaption>
      </figure>
    </div>
  );
}

export default function Mission() {
  const ref = useRef<HTMLElement>(null);
  const words = mission.split(' ');

  useMotion(ref, (mm, root) => {
    const q = sel(root);

    mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
      const stage = q('.stage')[0] as HTMLElement;
      const para = q('.sentence p')[0] as HTMLElement;
      const bodyW = q('.w--body')[0] as HTMLElement;
      const others = q('.sentence .w:not(.w--body)') as HTMLElement[];
      const cut = q('.cutword')[0] as HTMLElement;
      const halves = q('.cutword > span') as HTMLElement[];
      const lettersTop = q('.cutword__top .c') as HTMLElement[];
      const lettersBot = q('.cutword__bot .c') as HTMLElement[];
      const stim = q('.stim')[0] as HTMLElement;
      const svg = q('.stim svg')[0] as SVGSVGElement;
      const wave = q('.stim .wave')[0] as SVGPathElement;
      const dots = q('.stim g circle:first-child') as SVGCircleElement[];
      // Measurements use layout offsets (unaffected by transforms) and rerun on every refresh.
      const m = { W: 0, H: 0, fs: 0, cx: 0, cy: 0, s: 1, h: 0, wordW: 0, dx: [] as number[] };
      const measure = () => {
        m.W = stage.clientWidth; m.H = stage.clientHeight;
        m.fs = parseFloat(getComputedStyle(para).fontSize);
        halves.forEach((el) => { el.style.fontSize = `${m.fs}px`; });
        m.cx = bodyW.offsetLeft + bodyW.offsetWidth / 2;
        m.cy = bodyW.offsetTop + bodyW.offsetHeight / 2;
        const ww = halves[0].offsetWidth || 1;
        m.wordW = m.W * (window.matchMedia('(max-width: 899px)').matches ? 0.74 : 0.44);
        m.s = m.wordW / ww;
        m.h = m.fs * m.s;
        m.dx = lettersTop.map((c) => c.offsetLeft + c.offsetWidth / 2 - ww / 2);
        svg.setAttribute('viewBox', `0 0 ${m.W} 120`);
      };
      measure();
      ScrollTrigger.addEventListener('refresh', measure);
      ctx.add(() => () => ScrollTrigger.removeEventListener('refresh', measure));

      // State driven by the scrubbed timeline; rendered in one place.
      const st = { t: 0 };
      const render = () => {
        const t = st.t;
        // Stimulation baseline: draws outward from both edges toward the word.
        const draw = range(t, T.drawA, T.drawB);
        const half = m.W / 2;
        const reach = draw * half;
        const blips: number[] = [];
        dots.forEach((dot, k) => {
          const emit = T.pulseA + k * T.pulseGap;
          const p = range(t, emit, emit + T.travel);
          const travelling = t >= emit && p < 1;
          const x = p * (half - m.wordW / 2 - 10);
          dot.setAttribute('cx', String(x));
          (dot.nextElementSibling as SVGCircleElement).setAttribute('cx', String(m.W - x));
          const vis = travelling ? '1' : '0';
          dot.style.opacity = vis;
          (dot.nextElementSibling as SVGCircleElement).style.opacity = vis;
          if (travelling) blips.push(x);
        });
        const seg = (from: number, to: number, xs: number[], dir: 1 | -1) => {
          let d = '';
          xs.filter((x) => x > 10 && x < to - 10).forEach((x) => {
            const X = dir === 1 ? x : m.W - x;
            d += ` L${X - 6 * dir} 60 L${X - 6 * dir} 26 L${X} 26 L${X} 94 L${X + 6 * dir} 94 L${X + 6 * dir} 60`;
          });
          return `M${dir === 1 ? from : m.W - from} 60${d} L${dir === 1 ? to : m.W - to} 60`;
        };
        const sorted = [...blips].sort((a, b) => a - b);
        wave.setAttribute('d', reach > 0 ? `${seg(0, reach, sorted, 1)} ${seg(0, reach, sorted, -1)}` : 'M0 60');

        // Contraction: a sum of damped impulses, one per pulse arrival.
        let c = 0;
        for (let k = 0; k < PULSES; k++) {
          const arrive = T.pulseA + k * T.pulseGap + T.travel;
          const dt = t - arrive;
          if (dt > 0) c += Math.min(1, dt / 0.05) * Math.exp(-dt / 0.28);
        }
        c = Math.min(c, 1.25);
        [lettersTop, lettersBot].forEach((set) =>
          set.forEach((el, i) => gsap.set(el, { x: -m.dx[i] * 0.2 * c, scaleX: 1 - 0.07 * c, scaleY: 1 + 0.12 * c })),
        );
      };

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root, start: 'top top', end: () => `+=${window.innerHeight * 3.6}`,
          pin: stage, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        },
      });

      // 1 · everything but "body" falls, each released at its own moment, accelerating.
      const rnd = gsap.utils.random(0, 1, 0.001, true);
      const seeds = others.map((_, i) => ((Math.sin(i * 91.7) + 1) / 2));
      others.forEach((w, i) => {
        const start = 0.9 + seeds[i] * 1.3;
        tl.to(w, {
          y: () => m.H - w.offsetTop + 60 + rnd() * 80,
          rotation: (seeds[i] - 0.5) * 18,
          duration: 1.5 + seeds[i] * 0.4,
          ease: 'power2.in',
        }, start);
      });
      tl.set(cut, { visibility: 'visible' }, 0.85).set(bodyW, { opacity: 0 }, 0.85);
      tl.fromTo(cut,
        { x: () => m.cx - m.W / 2, y: () => m.cy - m.H / 2, scale: 1 },
        { x: 0, y: 0, scale: () => m.s, duration: 2.2, ease: 'power3.inOut' }, 1.4);
      tl.fromTo(q('.mission__label'), { clipPath: 'inset(0 0% 0 0)' }, { clipPath: 'inset(0 100% 0 0)', duration: 0.8 }, 1.2);

      // 2 · baseline under the word, labels; 3 · pulses and contraction (render()).
      tl.set(stim, { y: () => m.h * 0.34 }, 0);
      tl.from(q('.stim__lab .ch'), { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.5em', duration: 0.8, ease: 'expo.out' }, T.drawB - 0.4);
      tl.to(st, { t: T.end, duration: T.end, onUpdate: render }, 0);

      // 4 · the baseline rises to the cut line; section marks resolve.
      tl.to(stim, { y: 0, duration: 0.7, ease: 'power2.inOut' }, T.cutPrep)
        .to(q('.stim__lab .ch'), { clipPath: 'inset(0 0 0 100%)', duration: 0.4 }, T.cutPrep)
        .from(q('.stim__lab .sec'), { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.5em', duration: 0.6, ease: 'expo.out' }, T.cutPrep + 0.3);

      // 5 · the word parts along the cut; Project 01 opens between the halves.
      tl.to(q('.cutword__top'), { y: () => -(m.H * 0.34) / m.s, duration: 1.4, ease: 'power3.inOut' }, T.cut)
        .to(q('.cutword__bot'), { y: () => (m.H * 0.34) / m.s, duration: 1.4, ease: 'power3.inOut' }, T.cut)
        .to(q('.reveal'), { clipPath: 'inset(0% 0 0% 0)', duration: 1.4, ease: 'power3.inOut' }, T.cut)
        .from(q('.reveal__fig .plate'), { clipPath: 'inset(0 50% 0 50%)', duration: 1.0, ease: 'power3.inOut' }, T.cut + 0.5)
        .to(stim, { y: () => m.H / 2 - 1, duration: 1.2, ease: 'power3.inOut' }, T.cut + 0.6)
        .to(q('.stim__lab'), { opacity: 0, duration: 0.3 }, T.cut + 0.6)
        .to(cut, { opacity: 0, duration: 0.3 }, T.end - 0.4);

      render();
    });

    mm.add(MQ.reduced, () => undefined);
  });

  if (reducedMotion()) {
    return (
      <section id="mission" className="mission wrap" style={{ paddingBlock: '120px 0' }}>
        <p className="mono">01 — Current mission</p>
        <p className="serif" style={{ fontSize: 'clamp(36px, 5vw, 72px)', lineHeight: 1.04, margin: '16px 0 96px', maxWidth: '15.5em' }}>{mission}</p>
        <ChapterHeader />
      </section>
    );
  }

  return (
    <section id="mission" className="mission" ref={ref} aria-label="Current mission">
      <div className="stage">
        <div className="reveal" id="ta01-head"><ChapterHeader /></div>
        <p className="mission__label mono">01 — Current mission</p>
        <div className="sentence" data-cursor="hide">
          <p className="serif">
            {words.map((w, i) => {
              const isBody = w === 'body';
              return (
                <span key={i}>
                  <span className={`w${isBody ? ' w--body' : ''}`}>{w}</span>{i < words.length - 1 ? ' ' : ''}
                </span>
              );
            })}
          </p>
        </div>
        <div className="cutword" aria-hidden="true">
          <span className="cutword__top">{LETTERS.map((l, i) => <span className="c" key={i}>{l}</span>)}</span>
          <span className="cutword__bot">{LETTERS.map((l, i) => <span className="c" key={i}>{l}</span>)}</span>
        </div>
        <div className="stim" aria-hidden="true">
          <div className="stim__lab stim__lab--l mono">
            <span className="ch">CH-1 · biphasic</span>
            <span className="sec" style={{ position: 'absolute', left: 0, display: 'flex', gap: 10, alignItems: 'center' }}><span className="secmark">A</span>Section</span>
          </div>
          <div className="stim__lab stim__lab--r mono">
            <span className="ch">CH-2 · biphasic</span>
            <span className="sec" style={{ position: 'absolute', right: 0, display: 'flex', gap: 10, alignItems: 'center' }}>Section<span className="secmark">A</span></span>
          </div>
          <svg preserveAspectRatio="none">
            <path className="wave" d="M0 60" />
            {Array.from({ length: PULSES }).map((_, i) => (
              <g key={i}><circle className="pulse" r="4" cy="60" cx="0" style={{ opacity: 0 }} /><circle className="pulse" r="4" cy="60" cx="0" style={{ opacity: 0 }} /></g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
