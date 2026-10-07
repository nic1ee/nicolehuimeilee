import { useEffect, useRef } from 'react';
import { gsap, finePointer, reducedMotion } from '../motion/setup';

/**
 * A 6 px dot with a little inertia. States come from the nearest [data-cursor] ancestor:
 * view (ring reading VIEW), cross (crosshair over diagrams), hide (over giant type), link.
 */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !finePointer() || reducedMotion()) { if (el) el.style.display = 'none'; return; }
    const xTo = gsap.quickTo(el, 'x', { duration: 0.28, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.28, ease: 'power3.out' });
    let shown = false;

    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      if (!shown) { gsap.set(el, { x: e.clientX, y: e.clientY, opacity: 1 }); shown = true; }
      xTo(e.clientX); yTo(e.clientY);
      const t = (e.target as Element | null)?.closest?.('[data-cursor], a, button');
      let state = t?.getAttribute('data-cursor') ?? (t ? 'link' : 'default');
      el.dataset.state = state;
      el.classList.toggle('cursor--night', document.documentElement.hasAttribute('data-night'));
    };
    const leave = () => { gsap.to(el, { opacity: 0, duration: 0.2 }); shown = false; };
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    return () => { window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); };
  }, []);

  return (
    <div className="cursor" ref={ref} aria-hidden="true" style={{ opacity: 0 }} data-state="default">
      <span className="cursor__dot" />
      <span className="cursor__ring"><span>VIEW</span></span>
      <span className="cursor__cross" />
    </div>
  );
}
