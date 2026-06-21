# Aldermere — Website Hosting Export

This folder is the **complete, ready-to-upload website**. Everything it needs is
inside, with correct relative paths. The header, navigation, and footer are
**baked directly into every HTML file**, so the full UI renders **even if
JavaScript is disabled or blocked** — no blank pages.

> **Is this Next.js / React / Vite?** **No.** It is a plain static HTML/CSS/JS
> site. **There is NO build or `npm run build` step to run.** The files in this
> folder ARE the final website. Just upload them.

---

## 1. Folder structure

```
hosting-export/
├── index.html            ← Home page (the entry point)
├── about.html  services.html  portfolio.html  process.html
├── financing.html  reviews.html  blog.html  faq.html  contact.html
├── kitchen-remodeling.html  bathroom-remodeling.html
├── whole-home-remodeling.html  home-additions.html  outdoor-living.html
├── project-hawthorne.html  project-ashby.html  project-linden.html
├── blog-kitchen-trends.html  blog-renovation-budget.html  blog-natural-stone.html
│
├── assets/
│   ├── css/  styles.css, pages.css
│   └── js/   site.js (nav/footer behaviour), main.js (home video scrubbing)
├── images/   before1.png, after1.png   (Before/After slider)
├── videos/   herosection1-scrub.mp4, middlesection1-scrub.mp4  (scroll-scrubbed)
│
├── .nojekyll               ← tells GitHub Pages to serve files as-is
├── local-preview-server.js ← optional local tester (do not need to upload)
└── README.md
```

`index.html` sits at the root, so your home page is served at
`https://yourdomain.com/`.

---

## 2. How to upload — IMPORTANT

**Upload the *contents* of this folder, not the folder itself.** `index.html`
must end up at the root of your site, with `assets/`, `images/`, and `videos/`
right beside it.

### GitHub Pages (most common cause of a "blank page")
A blank GitHub Pages site is almost always one of these — check each:

1. **Files must be at the repo ROOT**, not inside a subfolder.
   Put `index.html`, `assets/`, `images/`, `videos/`, and `.nojekyll`
   directly in the repository root (or in a `/docs` folder if you choose the
   "/docs" option). If everything is inside `hosting-export/…` in the repo,
   Pages won't find `index.html` and you'll get a blank/404 page.
2. **Enable Pages**: repo → **Settings → Pages → Build and deployment →
   Source: "Deploy from a branch"**, branch `main`, folder `/ (root)`
   (or `/docs`). Save, wait ~1 minute.
3. **Keep `.nojekyll`** (it's included here). It stops GitHub's Jekyll engine
   from interfering with the `assets/` folder. It's a hidden file — make sure it
   gets committed.
4. Open the **Pages URL** it gives you (e.g.
   `https://yourname.github.io/your-repo/`) — not the repository "Code" page.

> Project sites live under a subpath like `…github.io/your-repo/`. This site uses
> **relative paths**, so it works correctly under a subpath with no changes.

### Netlify / Vercel / Cloudflare Pages (easiest)
- Drag the **contents** of this folder into the deploy area, or set the
  **publish/output directory** to this folder.
- **Build command: leave EMPTY.** There is no build.

### Traditional hosting (cPanel / FTP)
- Upload the **contents** into your web root (`public_html/`), preserving the
  `assets/ images/ videos/` subfolders.

---

## 3. Will it look right? (yes — here's why)

- **Header, nav menu, and footer are hard-coded into every page.** They appear
  with zero JavaScript.
- **CSS is plain `<link>` tags** to `assets/css/…` (relative paths).
- **All content is visible by default.** JavaScript only adds optional
  scroll-fade animations and the home-page video effects — if a script fails to
  load, you still see the complete, styled site.
- **No absolute paths, no framework, no build artifacts** to go missing.

---

## 4. Videos (already handled)

The home hero and mid-page showcase use scroll-scrubbed video, which needs a host
that supports **HTTP Range requests**. GitHub Pages, Netlify, Vercel, Cloudflare,
Apache, nginx, and S3/CloudFront all do this automatically — nothing to
configure.

---

## 5. Preview locally before uploading (optional)

Run from **inside this folder**, then open the URL it prints:

- **Node:** `node local-preview-server.js` → http://localhost:4321
- **Python 3:** `python -m http.server 8000` → http://localhost:8000
- **VS Code:** "Live Server" extension → right-click `index.html` → Open with Live Server

(Use a local server rather than double-clicking the file — browsers limit video
range requests on `file://`.)

---

## 6. External resources (loaded from the internet, nothing to upload)

To keep the upload small, these load from public CDNs and work automatically on
any hosted site:

- **Fonts** — Cormorant Garamond + Inter (Google Fonts)
- **GSAP** — scroll-animation library (cdnjs)
- **Decorative photography** — editorial room/house photos (Unsplash CDN)

Your own assets (the Before/After photos and both videos) are bundled locally in
`images/` and `videos/`. To make the site fully self-contained, download the
Unsplash photos into `images/` and swap the `https://images.unsplash.com/…` URLs
for local paths — optional; the site works as delivered.

---

## 7. Final checklist

- [ ] Uploaded the **contents** (so `index.html` is at the site root).
- [ ] `assets/`, `images/`, `videos/`, and `.nojekyll` are beside `index.html`.
- [ ] (GitHub) Pages enabled, source = branch root or `/docs`.
- [ ] No build command set anywhere — it's static.
- [ ] Opened the live URL — header, styling, and all 21 pages work.
