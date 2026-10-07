import { useEffect, useRef, useState } from 'react';
import { gsap, scrollToTarget, reducedMotion } from '../motion/setup';
import { chapters } from '../motion/gauge';
import { person } from '../content';

const NAV = [
  { href: '#ta01', label: 'Work', match: ['ta01', 'flight', 'orbit', 'mission'] },
  { href: '#index', label: 'Index', match: ['index'] },
  { href: '#trajectory', label: 'Trajectory', match: ['trajectory'] },
  { href: '#contact', label: 'Contact', match: ['recognition', 'contact'] },
];

const MENU = [
  { href: '#mission', n: '01', label: 'Mission' },
  { href: '#ta01', n: '02', label: 'Wearable NMES' },
  { href: '#flight', n: '03', label: 'Parabolic flight' },
  { href: '#orbit', n: '04', label: 'After the Station' },
  { href: '#index', n: '05', label: 'Index' },
  { href: '#trajectory', n: '06', label: 'Trajectory' },
  { href: '#contact', n: '07', label: 'Contact' },
];

export function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return;
  e.preventDefault();
  scrollToTarget(href, 1.8);
  history.replaceState(null, '', href);
}

export default function Header() {
  const [chapter, setChapter] = useState(chapters.get());
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const openBtn = useRef<HTMLButtonElement>(null);

  useEffect(() => chapters.on(setChapter) as unknown as () => void, []);

  // Menu: an ink sheet falls from the top edge; links rise from their baselines.
  // Closing is faster and retracts upward, like a shutter.
  useEffect(() => {
    const root = menuRef.current;
    if (!root) return;
    const sheet = root.querySelector('.menu__sheet');
    const edge = root.querySelector('.menu__edge');
    const items = root.querySelectorAll('.menu li .line-mask > span');
    const t = gsap.timeline({ paused: true });
    t.set(sheet, { clipPath: 'inset(0% 0% 100% 0%)' })
      .to(edge, { scaleX: 1, duration: 0.35, ease: 'power3.inOut' })
      .to(sheet, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'expo.inOut' }, '-=0.1')
      .from(items, { yPercent: 105, duration: 0.8, ease: 'expo.out', stagger: 0.045 }, '-=0.3');
    tl.current = t;
    return () => { t.kill(); };
  }, []);

  useEffect(() => {
    const t = tl.current;
    if (!t) return;
    if (reducedMotion()) { t.progress(open ? 1 : 0); return; }
    if (open) t.timeScale(1).play();
    else t.timeScale(1.8).reverse();
    if (open) menuRef.current?.querySelector<HTMLElement>('.menu__close')?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <header className="hdr">
        <div className="wrap hdr__in">
          <a className="hdr__id mono" href="#hero" onClick={(e) => go(e, '#hero')} data-cursor="link">
            <span>N. Lee</span><span className="muted">/ TA-001</span>
          </a>
          <nav className="hdr__nav" aria-label="Primary">
            {NAV.map((n) => (
              <a key={n.href} className="mono" href={n.href} onClick={(e) => go(e, n.href)}
                aria-current={n.match.includes(chapter) ? 'true' : undefined} data-cursor="link">
                <span className="tick" aria-hidden="true" />{n.label}
              </a>
            ))}
          </nav>
          <div className="hdr__right mono">
            <span className="hdr__coord muted">{person.lat} · {person.lon}</span>
            <span className="gauge" aria-label="Current g level"><i aria-hidden="true" />g <span data-g>1.00</span></span>
            <button ref={openBtn} className="hdr__menu mono" type="button" aria-expanded={open} aria-controls="menu" onClick={() => setOpen(true)}>Index</button>
          </div>
        </div>
      </header>

      <div id="menu" ref={menuRef} className={`menu${open ? ' menu--open' : ''}`} aria-hidden={!open}>
        <div className="menu__sheet" role="dialog" aria-modal="true" aria-label="Site index">
          <span className="menu__edge" aria-hidden="true" />
          <button className="menu__close mono" type="button" onClick={() => { setOpen(false); openBtn.current?.focus(); }} tabIndex={open ? 0 : -1}>Close</button>
          <ol>
            {MENU.map((m) => (
              <li key={m.href}>
                <a href={m.href} tabIndex={open ? 0 : -1} onClick={(e) => { setOpen(false); go(e, m.href); }}>
                  <span className="mono" style={{ color: 'var(--night-muted)' }}>{m.n}</span>
                  <span className="line-mask"><span className="serif">{m.label}</span></span>
                </a>
              </li>
            ))}
          </ol>
          <p className="mono" style={{ margin: 0, color: 'var(--night-muted)' }}>{person.email} · {person.place}</p>
        </div>
      </div>
    </>
  );
}
