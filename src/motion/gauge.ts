/**
 * The g gauge: one value shared by the header readout, the flight field's large numeral
 * and the "return to 1 G" link. Writes straight to the DOM so it never re-renders React.
 */
type Listener = (g: number) => void;
let current = 1;
const listeners = new Set<Listener>();

export const gauge = {
  get: () => current,
  set(g: number) {
    if (Math.abs(g - current) < 0.0005) return;
    current = g;
    const text = g.toFixed(2);
    document.querySelectorAll<HTMLElement>('[data-g]').forEach((el) => {
      if (el.textContent !== text) el.textContent = text;
    });
    listeners.forEach((fn) => fn(g));
  },
  on(fn: Listener) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};

/** Chapter state for the rail and the H·S·E motif. */
type ChapterListener = (id: string) => void;
let chapter = 'hero';
const chapterListeners = new Set<ChapterListener>();
export const chapters = {
  get: () => chapter,
  set(id: string) {
    if (id === chapter) return;
    chapter = id;
    chapterListeners.forEach((fn) => fn(id));
  },
  on(fn: ChapterListener) {
    chapterListeners.add(fn);
    return () => chapterListeners.delete(fn);
  },
};
