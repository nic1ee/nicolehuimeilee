# Nic Lee — personal site

Vite + React + TypeScript, GSAP (ScrollTrigger, MorphSVG) and Lenis. Static build with relative
paths, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
```

## Editing content
All copy and data live in `src/content.ts`. Lines marked `REVIEW` are interpretations to confirm.

## Replacing image placeholders
Grey plates labelled like `[NMES electrode test — macro 4:5, B&W]` mark where photos go and at
what crop. Put images in `public/` and swap the `.plate` element for an `<img>` at the same ratio.
- Mission / Project 01: NMES electrode test, macro 4:5 (`src/components/Mission.tsx`)
- Index previews: one per entry, ratios in `src/content.ts` → `archive[].image`
- CV: replace `public/Nic_Lee_CV.pdf`

## Motion
See `MOTION.md` for the storyboard and motion language. Every composition has a
reduced-motion version that renders in its final state.

## Turning on GitHub Pages
Repository → Settings → Pages → Source: **GitHub Actions**. The next push to `main` publishes.
