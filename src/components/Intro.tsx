import { useRef } from 'react';
import { gsap, finePointer } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { facts, person } from '../content';

const LINES: { text: string; em?: boolean }[][] = [[{ text: 'Nicole' }], [{ text: 'Huimei' }, { text: 'Lee' }]];

/**
 * Opening. On load the name rises line by line, a hairline draws under it, the facts resolve
 * and the portrait opens like a camera shutter.
 *
 * The one playful moment: hover the name (or tap it on a phone) and gravity switches off.
 * Each letter lifts and drifts on its own spring; move away and they settle back onto the
 * baseline with a little weight. Scrolling past the intro, the portrait slides inside its frame.
 */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add('(prefers-reduced-motion: no-preference)', (ctx) => {
      const name = q('.intro__name')[0] as HTMLElement;
      const masks = q('.intro__name .line-mask') as HTMLElement[];
      const letters = q('.intro__name .gl') as HTMLElement[];
      const readout = q('.intro__g')[0] as HTMLElement;

      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'expo.out' } });
      tl.from(q('.intro__name .line-mask > span'), { yPercent: 108, duration: 1.3, stagger: 0.09 })
        .set(masks, { overflow: 'visible' })
        .from(q('.intro__rule'), { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'power3.inOut' }, 0.3)
        .from(q('.intro__facts > div'), { clipPath: 'inset(0 100% 0 0)', duration: 1.0, stagger: 0.08 }, 0.8)
        .from(q('.intro__kicker'), { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.4em', duration: 1.1 }, 0.6)
        .from(q('.shutter'), { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut' }, 0.5)
        .from(q('.shutter__img'), { clipPath: 'inset(50% 0 50% 0)', duration: 1.4, ease: 'expo.inOut' }, 1.1)
        .from(q('.shutter__img img'), { scale: 1.14, duration: 1.8 }, 1.1)
        .from(q('.figcap > *'), { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.4em', duration: 1.0, stagger: 0.1 }, 1.7);

      // Portrait drifts inside its frame as the page moves on.
      gsap.fromTo(q('.shutter__img img'), { yPercent: 0 }, {
        yPercent: 8, ease: 'none',
        scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
      });

      // ---- weightless name ----
      const seeds = letters.map((_, i) => [Math.sin(i * 12.99) * 0.5 + 0.5, Math.sin(i * 78.23) * 0.5 + 0.5, Math.sin(i * 39.42) * 0.5 + 0.5]);
      const P = letters.map(() => ({ y: 0, vy: 0, x: 0, vx: 0, r: 0, vr: 0 }));
      const G = { target: 1, g: 1 };
      let time = 0, prev = 1, running = false, idle = 0;
      const step = () => {
        const dt = Math.min(gsap.ticker.deltaRatio(60) / 60, 1 / 30);
        time += dt;
        G.g += (G.target - G.g) * Math.min(1, dt * 5);
        const g = G.g;
        const drop = Math.max(0, prev - g); prev = g;
        const k = 160 * g + 1.2;
        const c = 2 * Math.sqrt(k) * (g < 0.1 ? 0.35 : 0.8);
        let energy = 0;
        P.forEach((p, i) => {
          const [a, b, d] = seeds[i];
          if (drop > 0) { p.vy -= drop * (30 + 40 * a); p.vx += drop * (b - 0.5) * 16; p.vr += drop * (d - 0.5) * 24; }
          let ay = -k * p.y - c * p.vy, ax = -k * p.x - c * p.vx, ar = -k * p.r - c * p.vr;
          if (g < 0.1) { ay += Math.sin(time * 0.7 + i * 1.7) * 6; ax += Math.cos(time * 0.5 + i * 2.3) * 2; ar += Math.sin(time * 0.6 + i) * 4; }
          p.vy += ay * dt; p.y = gsap.utils.clamp(-34, 10, p.y + p.vy * dt);
          p.vx += ax * dt; p.x = gsap.utils.clamp(-8, 8, p.x + p.vx * dt);
          p.vr += ar * dt; p.r = gsap.utils.clamp(-12, 12, p.r + p.vr * dt);
          const squash = 1 + gsap.utils.clamp(-0.04, 0.04, -p.vy * 0.0008);
          letters[i].style.transform = `translate(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px) rotate(${p.r.toFixed(2)}deg) scaleY(${squash.toFixed(3)})`;
          energy += Math.abs(p.y) + Math.abs(p.vy) + Math.abs(p.r);
        });
        readout.textContent = `g ${g.toFixed(2)}`;
        idle = G.target === 1 && energy < 0.5 ? idle + 1 : 0;
        if (idle > 30) { gsap.ticker.remove(step); running = false; letters.forEach((l) => { l.style.transform = ''; }); readout.textContent = 'g 1.00'; }
      };
      const start = () => { if (!running) { running = true; idle = 0; gsap.ticker.add(step); } };
      const float = () => {
        if (G.target === 0) return;
        G.target = 0; name.dataset.float = 'true';
        // Release: each letter gets its own small push off the baseline.
        P.forEach((p, i) => { const [a, b, d] = seeds[i]; p.vy -= 26 + 34 * a; p.vx += (b - 0.5) * 22; p.vr += (d - 0.5) * 34; });
        start();
      };
      const land = () => { G.target = 1; name.dataset.float = 'false'; start(); };

      const onEnter = () => { if (tl.progress() === 1) float(); };
      const onTap = () => { if (tl.progress() < 1) return; if (G.target === 1) float(); else land(); };
      if (finePointer()) {
        name.addEventListener('pointerenter', onEnter);
        name.addEventListener('pointerleave', land);
      } else {
        name.addEventListener('click', onTap);
      }
      ctx.add(() => () => {
        name.removeEventListener('pointerenter', onEnter);
        name.removeEventListener('pointerleave', land);
        name.removeEventListener('click', onTap);
        gsap.ticker.remove(step);
      });
      return () => tl.kill();
    });
  });

  return (
    <section id="top" className="intro" ref={ref} aria-labelledby="name">
      <div className="wrap intro__grid">
        <div className="intro__text">
          <p className="mono muted intro__kicker">MIT · Aeronautics and Astronautics</p>
          <h1 id="name" className="intro__name serif" aria-label="Nicole Huimei Lee" data-cursor="hide">
            {LINES.map((line, li) => (
              <span className="line-mask" key={li} aria-hidden="true">
                <span>
                  {line.map((w, wi) => (
                    <span key={wi} className={w.em ? 'word em' : 'word'}>
                      {w.text.split('').map((ch, i) => <span className="gl" key={i}>{ch}</span>)}
                    </span>
                  ))}
                </span>
              </span>
            ))}
          </h1>
          <div className="intro__rule" aria-hidden="true"><span className="intro__g mono">g 1.00</span></div>
          <dl className="intro__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="mono">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="intro__fig" data-cursor="hide">
          <div className="shutter">
            <div className="shutter__img">
              <img src="./nic-portrait.jpg" alt={`Portrait of ${person.name}`} width="1000" height="1249" fetchPriority="high" />
            </div>
            <span className="shutter__corner" aria-hidden="true" />
          </div>
          <figcaption className="figcap mono muted">
            <span>{person.place}</span>
            <span>{person.lat} · {person.lon}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
