# Nic Lee — personal site

Vite + React + TypeScript with GSAP for a short opening animation. Static build with relative
paths, deployed to GitHub Pages by `.github/workflows/deploy.yml` on every push to `main`.

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
```

## Editing content
Everything the site says is in `src/content.ts`: your name, the three facts beside it, the
biography (one string per paragraph) and links. Replace `public/Nic_Lee_CV.pdf` with your
current CV and `public/nic-portrait.jpg` with a new portrait if you like.

## Turning on GitHub Pages
Repository → Settings → Pages → Source: **GitHub Actions**. The next push to `main` publishes.
