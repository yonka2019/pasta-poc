# Pasta La Vista

React + Vite redesign of the Pasta La Vista pickup-order site (Hebrew, RTL).

```sh
npm install
cp .env.example .env
npm run dev      # http://localhost:24325 (LAN too)
npm run build    # → dist/
```

- Menu/prices/hours: `src/data.js`
- Checkout is a demo — no order is sent.
- `.env` → `VITE_SITE_URL` = public origin (for `og:image`). Set before deploy.
- Photo crops: `scripts/crop-plates.ps1 raw public/img`
