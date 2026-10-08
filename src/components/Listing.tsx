import { useRef } from 'react';
import { gsap } from '../motion/setup';
import { useMotion, sel } from '../motion/useMotion';
import { news, publications } from '../content';

function useRowsIn() {
  const ref = useRef<HTMLElement>(null);
  useMotion(ref, (mm, root) => {
    const q = sel(root);
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(q('.item'), {
        clipPath: 'inset(0 100% 0 0)', duration: 1.1, ease: 'expo.out', stagger: 0.08,
        scrollTrigger: { trigger: root, start: 'top 78%' },
      });
    });
  });
  return ref;
}

export function Publications() {
  const ref = useRowsIn();
  return (
    <section id="publications" className="sec" ref={ref} aria-labelledby="pub-title">
      <div className="wrap sec__grid">
        <div className="sec__lab"><h2 id="pub-title" className="mono">Publications</h2></div>
        <ol className="items">
          {publications.map((p) => {
            const body = (
              <>
                <span className="item__k mono muted">{p.year}</span>
                <span className="item__main">
                  <span className="item__title serif">{p.title}</span>
                  <span className="item__sub mono muted">{p.venue}</span>
                </span>
                <span className="item__x mono" aria-hidden="true">{p.href ? '↗' : ''}</span>
              </>
            );
            return (
              <li key={p.title} className="item">
                {p.href
                  ? <a className="item__row" href={p.href} target="_blank" rel="noopener">{body}</a>
                  : <div className="item__row">{body}</div>}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

export function News() {
  const ref = useRowsIn();
  if (news.length === 0) return null;
  return (
    <section id="news" className="sec" ref={ref} aria-labelledby="news-title">
      <div className="wrap sec__grid">
        <div className="sec__lab"><h2 id="news-title" className="mono">News</h2></div>
        <ul className="items">
          {news.map((n) => (
            <li key={n.date + n.text} className="item">
              <div className="item__row">
                <span className="item__k mono muted">{n.date}</span>
                <span className="item__news">
                  {n.href ? <a className="tlink" href={n.href} target="_blank" rel="noopener">{n.text} ↗</a> : n.text}
                </span>
                <span />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
