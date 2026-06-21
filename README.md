# Aldermere — Website Hosting Export

This folder is the **complete, ready-to-upload website**. Everything the site
needs (pages, styles, scripts, images, videos) is inside this one folder with
correct relative paths. Open it, upload the contents, and you're live.

> **Is this a Next.js / React project?** **No.** It is a plain static
> HTML/CSS/JS website. **There is no build or export step to run** — the files
> in this folder *are* the final site. Just upload them as-is.

---

## 1. What's in here

```
hosting-export/
├── index.html                  ← Home page (entry point)
├── about.html
├── services.html
├── kitchen-remodeling.html
├── bathroom-remodeling.html
├── whole-home-remodeling.html
├── home-additions.html
├── outdoor-living.html
├── portfolio.html
├── project-hawthorne.html
├── project-ashby.html
├── project-linden.html
├── process.html
├── financing.html
├── reviews.html
├── blog.html
├── blog-kitchen-trends.html
├── blog-renovation-budget.html
├── blog-natural-stone.html
├── faq.html
├── contact.html
│
├── assets/
│   ├── css/
│   │   ├── styles.css          ← core design system
│   │   └── pages.css           ← inner-page components
│   └── js/
│       ├── site.js             ← shared header/footer/nav (every page)
│       └── main.js             ← home-page video scrubbing & slider
│
├── images/
│   ├── before1.png             ← Before/After slider — "before"
│   └── after1.png              ← Before/After slider — "after"
│
├── videos/
│   ├── herosection1-scrub.mp4  ← home hero (scroll-scrubbed)
│   └── middlesection1-scrub.mp4← mid-page showcase (scroll-scrubbed)
│
├── local-preview-server.js     ← OPTIONAL local tester (see §4). Not required on hosting.
└── README.md                   ← this file
```

**`index.html` is the home page.** Hosts automatically serve it as the default
document, so your home page will be at `https://yourdomain.com/`.

---

## 2. How to upload (pick whichever matches your host)

### A. Drag-and-drop hosts (Netlify, Vercel, Cloudflare Pages)
1. Sign in to your host.
2. Create a new site / project.
3. Drag the **contents of this `hosting-export` folder** (not the folder itself)
   into the upload area — or point it at this folder as the "publish directory".
4. No build command is needed. If asked, leave the build command **empty** and
   set the publish/output directory to this folder.

### B. cPanel / traditional web hosting (FTP, SFTP, File Manager)
1. Connect with your FTP client (FileZilla, etc.) or open the host's File Manager.
2. Go to your web root — usually `public_html/` (or `www/`, `htdocs/`).
3. Upload **everything inside this folder**, keeping the folder structure
   exactly (`assets/`, `images/`, `videos/` must stay as subfolders).
4. Make sure `index.html` lands directly in the web root.

### C. Amazon S3 + CloudFront, Azure, Google Cloud Storage
1. Upload the contents preserving the folder structure.
2. Set the bucket/website default document to `index.html`.
3. Ensure objects are publicly readable. (Range requests work by default.)

**Golden rule:** upload the *contents* of this folder so that `index.html`
sits at the site root and `assets/`, `images/`, `videos/` sit beside it.

---

## 3. Important: video playback (already handled, just confirm)

The home page hero and mid-page showcase use **scroll-scrubbed video**. For the
video to seek smoothly the host must support **HTTP Range requests** (byte
ranges). **Virtually every host does this automatically** — Netlify, Vercel,
Cloudflare Pages, GitHub Pages, Apache, nginx, S3/CloudFront, etc. You do not
need to configure anything. (If you ever self-host on a custom server, just make
sure it returns `206 Partial Content` for `.mp4` range requests.)

---

## 4. Preview it locally before uploading (optional)

Any of these will work — run from **inside this folder**:

- **VS Code**: install the "Live Server" extension, right-click `index.html` →
  "Open with Live Server".
- **Node** (included tester): `node local-preview-server.js` then open
  `http://localhost:4321`.
- **Python 3**: `python -m http.server 8000` then open `http://localhost:8000`.

> Tip: open the site through one of these local servers, **not** by
> double-clicking `index.html` from the file system. Browsers restrict some
> features (and video range requests) on `file://`, so a quick local server
> gives you an accurate preview.

`local-preview-server.js` is only a convenience for local testing. You can
upload it too (it's harmless and unused by the site) or simply leave it out.

---

## 5. External resources (loaded from the internet)

To keep the upload lean, two things load from public CDNs instead of being
bundled as files. They work automatically on any hosted site with internet
access — nothing to upload:

- **Fonts** — Cormorant Garamond + Inter, from Google Fonts.
- **GSAP** (animation library for the scroll effects) — from cdnjs.
- **Decorative photography** — the editorial room/house photos throughout the
  site are served from the Unsplash CDN.

Your **own** assets — the Before/After photos and both hero videos — are stored
locally in `images/` and `videos/` and are included in this folder.

> Want a 100% self-contained, offline-independent site? Download the Unsplash
> photos you want to keep, drop them in `images/`, and replace the
> `https://images.unsplash.com/...` URLs in the HTML/CSS with `images/your-file.jpg`.
> This is optional — the site works as delivered.

---

## 6. Quick checklist

- [ ] Upload the **contents** of this folder (index.html at the web root).
- [ ] Keep `assets/`, `images/`, `videos/` as subfolders next to the HTML.
- [ ] No build step — it's static HTML.
- [ ] Visit your domain — the home page loads, navigation works across all 21 pages.
- [ ] Scroll the home hero — the video scrubs with scroll (confirms Range support).

That's it. Welcome live.
