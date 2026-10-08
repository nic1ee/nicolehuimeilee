import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText };

export const reducedMotion = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const finePointer = (): boolean =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

let lenis: Lenis | null = null;
let tickerOn = false;

/** Inertial wheel scrolling on desktop; touch keeps native scrolling. Off for reduced motion. */
export function startSmoothScroll(): Lenis | null {
  if (reducedMotion()) return null;
  lenis?.destroy();
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  if (!tickerOn) {
    gsap.ticker.add((t) => lenis?.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    tickerOn = true;
  }
  return lenis;
}

export function stopSmoothScroll() {
  lenis?.destroy();
  lenis = null;
}

/** Scroll so a section's top sits just under the sticky header (or to a y position). */
export function scrollToTarget(target: string | number, duration = 1.4): void {
  let y = typeof target === 'number' ? target : 0;
  if (typeof target === 'string') {
    const el = document.querySelector(target);
    if (!el) return;
    y = el.getBoundingClientRect().top + window.scrollY - 64;
  }
  y = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
  if (lenis) {
    lenis.scrollTo(y, { duration, force: true, easing: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2) });
    return;
  }
  window.scrollTo({ top: y, behavior: reducedMotion() ? 'auto' : 'smooth' });
}
