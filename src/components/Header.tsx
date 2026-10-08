import { person } from '../content';
import { scrollToTarget } from '../motion/setup';

export function go(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
  if (!href.startsWith('#') || !document.querySelector(href)) return;
  e.preventDefault();
  scrollToTarget(href === '#top' ? 0 : href, 1.4);
  history.replaceState(null, '', href);
}

export default function Header() {
  return (
    <header className="hdr">
      <div className="wrap hdr__in">
        <a className="mono hdr__id" href="#top" onClick={(e) => go(e, '#top')}>{person.shortName}</a>
        <nav className="hdr__nav" aria-label="Primary">
          <a className="mono tlink hide-sm" href="#bio" onClick={(e) => go(e, '#bio')}>Biography</a>
          <a className="mono tlink hide-sm" href="#publications" onClick={(e) => go(e, '#publications')}>Publications</a>
          <a className="mono tlink hide-sm" href="#news" onClick={(e) => go(e, '#news')}>News</a>
          <a className="mono tlink" href={person.cv} target="_blank" rel="noopener">CV</a>
          <a className="mono tlink" href="#contact" onClick={(e) => go(e, '#contact')}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
