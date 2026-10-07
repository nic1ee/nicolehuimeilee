import { useRef } from 'react';
import { gsap, MQ } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { person } from '../content';

/**
 * 00 — "Coming online". Starts as the name alone; the ground line draws, labels resolve at
 * its ticks, the statement rises from its baselines, the portrait shutter opens to a band.
 * Scrolling opens the shutter fully and the ground line begins its pull-up.
 */
const FLAT = 'M0 36 L1000 36';
const LIFT = 'M0 36 L640 36 C760 36 840 30 1000 2';

export default function Hero() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const path = q('.ground path')[0] as SVGPathElement;
      const groundSvg = q('.ground svg')[0] as SVGSVGElement;

      const load = gsap.timeline({ delay: 0.25, defaults: { ease: 'expo.out' } });
      load
        .from(q('.hero__name'), { clipPath: 'inset(0 100% 0 0)', duration: 1.1 })
        .fromTo(groundSvg, { clipPath: 'inset(-20px 100% -20px 0)' }, { clipPath: 'inset(-20px 0% -20px 0)', duration: 1.6, ease: 'power2.inOut' }, 0.35)
        .from(q('.ground__labels .track'), {
          letterSpacing: '0.6em', clipPath: 'inset(0 100% 0 0)', duration: 1.1, stagger: 0.14,
        }, 0.9)
        .from(q('.hero__kicker .track'), { letterSpacing: '0.5em', clipPath: 'inset(0 100% 0 0)', duration: 1, stagger: 0.1 }, 1.0)
        .from(q('.hero__stmt .line-mask > span'), { yPercent: 108, duration: 1.3, stagger: 0.12 }, 1.15)
        .from(q('.hero__lede'), { clipPath: 'inset(0 0 100% 0)', duration: 1.2 }, 1.7)
        .from(q('.shutter'), { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut' }, 1.1)
        .from(q('.shutter__img'), { clipPath: 'inset(50% 0 50% 0)', duration: 1.2, ease: 'expo.inOut' }, 1.8)
        .from(q('.figcap'), { clipPath: 'inset(0 100% 0 0)', duration: 0.9 }, 2.2);

      // Scroll: the shutter finishes opening, a focal-plane scan passes, the line begins to lift.
      const scroll = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top top', end: '+=90%', scrub: 0.6, pin: true, anticipatePin: 1 },
        defaults: { ease: 'none' },
      });
      scroll
        .to(q('.shutter__img'), { clipPath: 'inset(0% 0 0% 0)', duration: 1, ease: 'power2.inOut' }, 0)
        .to(q('.shutter__img img'), { scale: 1, duration: 1 }, 0)
        .fromTo(q('.shutter__scan'), { opacity: 1, top: '0%' }, { top: '100%', duration: 0.9 }, 0.05)
        .to(q('.shutter__scan'), { opacity: 0, duration: 0.05 }, 0.95)
        .to(q('.hero__stmt'), { scale: 0.86, duration: 1 }, 0)
        .to(path, { morphSVG: LIFT, duration: 1, ease: 'power1.in' }, 0.2)
        .to(q('.ground__labels'), { y: -6, duration: 1 }, 0.2);
      return () => load.kill();
    });

    mm.add(MQ.reduced, () => {
      gsap.set(q('.shutter__img'), { clipPath: 'none' });
      gsap.set(q('.shutter__img img'), { scale: 1 });
    });
  });

  return (
    <section id="hero" className="hero" ref={ref} aria-label="Introduction">
      <div className="wrap hero__grid">
        <div className="hero__copy">
          <p className="hero__kicker mono muted">
            <span className="track">Human systems /</span><br />
            <span className="track">Spaceflight /</span><br />
            <span className="track">Extreme environments</span>
          </p>
          <p className="hero__name serif">{person.name}</p>
          <h1 className="hero__stmt serif">
            <span className="line-mask"><span>The body was built</span></span>
            <span className="line-mask"><span>for one gravity.</span></span>
            <span className="line-mask"><span><em>I design for the rest.</em></span></span>
          </h1>
          <p className="hero__lede">
            I’m a researcher in MIT’s Human Systems Lab building wearable countermeasures — electrical muscle
            stimulation, smart skinsuits — that keep astronauts’ bodies working in microgravity, and studying the
            policy that will govern what replaces the International Space Station.
          </p>
        </div>
        <figure className="hero__fig" data-cursor="hide">
          <div className="shutter">
            <div className="shutter__img">
              <img src="./nic-portrait.jpg" alt="Portrait of Nic Lee" width="1000" height="1249" fetchPriority="high" />
              <span className="shutter__scan" aria-hidden="true" />
            </div>
            <span className="shutter__corner" aria-hidden="true" />
          </div>
          <figcaption className="figcap mono"><span>Fig. 00 — N. Lee</span><span>HSL · Cambridge</span></figcaption>
        </figure>
      </div>
      <div className="wrap" style={{ width: '100%' }}>
        <div className="ground" aria-hidden="true">
          <svg viewBox="0 0 1000 72" preserveAspectRatio="none"><path d={FLAT} /></svg>
          <div className="ground__labels mono">
            <span className="track">{person.lat}</span>
            <span className="track">{person.lon}</span>
            <span className="track">Human Systems Lab</span>
            <span className="track">AeroAstro · MIT</span>
            <span className="track accent">1.00 G</span>
          </div>
        </div>
      </div>
    </section>
  );
}
