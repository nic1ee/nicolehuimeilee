import { useLayoutEffect, type RefObject } from 'react';
import { gsap } from './setup';

/**
 * Runs a GSAP setup scoped to a component, with gsap.matchMedia so each composition can
 * define its desktop, mobile and reduced-motion versions. Everything is reverted on unmount.
 */
export function useMotion(
  scope: RefObject<HTMLElement | null>,
  setup: (mm: gsap.MatchMedia, root: HTMLElement) => void,
  deps: unknown[] = [],
) {
  useLayoutEffect(() => {
    const root = scope.current;
    if (!root) return;
    const mm = gsap.matchMedia(root);
    setup(mm, root);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/** Scoped query helper; untyped on purpose so call sites can cast to SVG element types. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sel = (root: Element) => (s: string): any[] => Array.from(root.querySelectorAll(s));
