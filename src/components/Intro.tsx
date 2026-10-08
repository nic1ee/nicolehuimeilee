import { useRef } from 'react';
import { gsap } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { facts, person } from '../content';

/**
 * Opening: name, a few facts, portrait. On load the name resolves, a hairline draws
 * under it and the portrait opens like a camera shutter. Nothing moves after that.
 */
export default function Intro() {
  const ref = useRef<HTMLElement>(null);

  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({ delay: 0.2, defaults: { ease: 'expo.out' } });
      tl.from(q('.intro__name .line-mask > span'), { yPercent: 108, duration: 1.3, stagger: 0.1 })
        .from(q('.intro__rule'), { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'power3.inOut' }, 0.3)
        .from(q('.intro__facts > div'), { clipPath: 'inset(0 100% 0 0)', duration: 1.0, stagger: 0.08 }, 0.8)
        .from(q('.intro__coords .track'), { letterSpacing: '0.5em', clipPath: 'inset(0 100% 0 0)', duration: 1.0, stagger: 0.1 }, 0.9)
        .from(q('.shutter'), { clipPath: 'inset(0 0 100% 0)', duration: 1.0, ease: 'expo.inOut' }, 0.5)
        .from(q('.shutter__img'), { clipPath: 'inset(50% 0 50% 0)', duration: 1.4, ease: 'expo.inOut' }, 1.1)
        .from(q('.shutter__img img'), { scale: 1.12, duration: 1.8 }, 1.1)
        .from(q('.figcap'), { clipPath: 'inset(0 100% 0 0)', duration: 0.9 }, 1.8);
      return () => tl.kill();
    });
  });

  return (
    <section id="top" className="intro" ref={ref} aria-labelledby="name">
      <div className="wrap intro__grid">
        <div className="intro__text">
          <p className="mono muted intro__kicker">MIT · Aeronautics and Astronautics</p>
          <h1 id="name" className="intro__name serif">
            <span className="line-mask"><span>Nicole</span></span>
            <span className="line-mask"><span><em>“Nic”</em> Lee</span></span>
          </h1>
          <div className="intro__rule" aria-hidden="true" />
          <dl className="intro__facts">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="mono">{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <figure className="intro__fig">
          <div className="shutter">
            <div className="shutter__img">
              <img src="./nic-portrait.jpg" alt={`Portrait of ${person.name}`} width="1000" height="1249" fetchPriority="high" />
            </div>
            <span className="shutter__corner" aria-hidden="true" />
          </div>
          <figcaption className="figcap mono muted">
            <span>{person.place}</span>
            <span className="intro__coords"><span className="track">{person.lat}</span> <span className="track">{person.lon}</span></span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
