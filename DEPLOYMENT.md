# Deployment Guide — Cloudflare Pages & Static Hosting

DreamScape is fully static and zero-dependency at runtime. It can be deployed to Cloudflare Pages, Vercel, Netlify, GitHub Pages, or any modern web server in seconds.

---

## 1. Cloudflare Pages Deployment (Recommended)

### Automatic Git Integration
1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Navigate to **Workers & Pages** > **Create application** > **Pages** > **Connect to Git**.
3. Select your repository.
4. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `dreamscape` (or leave blank if repository root)
5. Under **Environment variables**, set:
   - `NODE_VERSION`: `20` or higher
6. Click **Save and Deploy**.

### Direct Wrangler CLI Deployment
You can also deploy directly from your local terminal using Cloudflare's `wrangler` CLI:
```bash
# Inside dreamscape directory
npm run build
npx wrangler pages deploy dist --project-name dreamscape
```

---

## 2. SPA Fallback & Static Headers Configuration

Since DreamScape is a single-page application using client-side query parameters (`?preset=...`), ensure standard single-page app fallback is configured:
Cloudflare Pages handles this automatically for `dist/index.html`.

For other static web hosts (e.g. Nginx or Apache):
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

---

## 3. Local Production Preview
To verify the production build locally before deploying:
```bash
npm run build
npm run preview
```
Visit `http://localhost:4173` to test the minified bundle.
