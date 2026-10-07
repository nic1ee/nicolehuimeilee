import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, MorphSVGPlugin, ScrollToPlugin);

export { gsap, ScrollTrigger };

export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/** Desktop compositions (pinned, horizontal) vs. the reinterpreted mobile ones. */
export const MQ = {
  desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
  mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
  reduced: '(prefers-reduced-motion: reduce)',
};

let lenis: Lenis | null = null;
let tickerOn = false;

export function startSmoothScroll(): Lenis | null {
  if (reducedMotion()) return null;
  lenis?.destroy();
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  if (!tickerOn) {
    gsap.ticker.add((t) => lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    tickerOn = true;
  }
  return lenis;
}

/** Scroll to an element or y; long and calm for "return to 1 G". */
export function scrollToTarget(target: string | number | HTMLElement, duration = 1.6): void {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
  if (el == null) return;
  if (lenis) {
    lenis.scrollTo(el as HTMLElement | number, {
      duration,
      easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
    });
  } else {
    const y = typeof el === 'number' ? el : el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
  }
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (t: number) => t * t * (3 - 2 * t);
/** Map v from [a,b] to [0,1], clamped. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a), 0, 1);
