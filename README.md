# Devbit Consulting website

Site for Michael Hultman and Devbit Consulting AB at https://devbit.se, in English and Swedish. Next.js 16, exported as static files.

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build   # static export to out/
```

Site copy lives in `src/messages/{en,sv}.json` and `src/data/`.

## Deploy

Every push to `main` builds and deploys to GitHub Pages (`.github/workflows/deploy.yml`).
