import { person } from '../content';

export function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#')) return;
  const el = document.querySelector(href);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  history.replaceState(null, '', href);
}

export default function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <a className="mono hdr__id" href="#top" onClick={(e) => go(e, '#top')}>{person.shortName}</a>
        <nav className="hdr__nav" aria-label="Primary">
          <a className="mono tlink" href="#bio" onClick={(e) => go(e, '#bio')}>Biography</a>
          <a className="mono tlink" href={person.cv} target="_blank" rel="noopener">CV</a>
          <a className="mono tlink" href="#contact" onClick={(e) => go(e, '#contact')}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
