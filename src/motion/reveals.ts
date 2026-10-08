import { gsap, SplitText } from './setup';

/**
 * The site's small motion vocabulary, shared by every section:
 *  - sectionLine: the hairline above a section draws left to right, then its orange tick lands.
 *  - riseRows:    rows rise out from behind their own top rule, one after another.
 *  - riseLines:   a paragraph's lines rise from behind their baselines.
 * All are one-shot on entry; nothing loops.
 */
export function sectionLine(root: HTMLElement) {
  const line = root.querySelector('.sec__line i');
  const tick = root.querySelector('.sec__line b');
  if (!line) return;
  const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: 'top 82%' } });
  tl.from(line, { scaleX: 0, transformOrigin: 'left center', duration: 1.4, ease: 'expo.inOut' });
  if (tick) tl.from(tick, { scale: 0, duration: 0.5, ease: 'expo.out' }, '-=0.25');
  tl.from(root.querySelectorAll('.sec__lab > *'), { clipPath: 'inset(0 100% 0 0)', letterSpacing: '0.4em', duration: 1, ease: 'expo.out' }, 0.3);
}

export function riseRows(root: HTMLElement, selector: string) {
  const rows = root.querySelectorAll<HTMLElement>(selector);
  if (!rows.length) return;
  gsap.from(rows, {
    clipPath: 'inset(0 0 100% 0)', y: 18, duration: 1.1, ease: 'expo.out', stagger: 0.09,
    clearProps: 'clipPath',
    scrollTrigger: { trigger: rows[0], start: 'top 86%' },
  });
}

export function riseLines(el: HTMLElement | null) {
  if (!el) return () => undefined;
  // autoSplit re-splits after webfonts load and on resize, so line breaks always match the real text.
  const split = SplitText.create(el, {
    type: 'lines', mask: 'lines', linesClass: 'ln', autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, {
      yPercent: 105, duration: 1.2, ease: 'expo.out', stagger: 0.07,
      scrollTrigger: { trigger: el, start: 'top 82%', once: true },
    }),
  });
  return () => split.revert();
}
