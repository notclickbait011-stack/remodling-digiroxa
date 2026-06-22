/* ============================================================
   ALDERMERE — interactions
   ============================================================ */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

  /* ---------- Loader ---------- */
  function dismissLoader(loader) {
    loader.classList.add('is-done');
    document.body.style.overflow = '';
    const hero = document.getElementById('hero');
    if (hero) hero.classList.add('is-ready'); // triggers the hero entrance
  }

  function initLoader() {
    const loader = document.getElementById('loader');
    const fill = document.getElementById('loaderFill');
    if (!loader) {
      const hero = document.getElementById('hero');
      if (hero) hero.classList.add('is-ready');
      return;
    }

    let p = 0;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      setTimeout(() => dismissLoader(loader), 220);
    };
    const tick = () => {
      p += Math.random() * 18 + 6;
      if (p >= 100) p = 100;
      if (fill) fill.style.width = p + '%';
      if (p < 100) setTimeout(tick, 110);
      else finish();
    };
    // (No scroll lock — the loader covers the viewport; locking could trap the
    // page if dismissal ever fails.)
    if (reduceMotion) {
      if (fill) fill.style.width = '100%';
      dismissLoader(loader);
    } else {
      setTimeout(tick, 200);
    }
    // Safety fallback
    window.addEventListener('load', () => setTimeout(finish, 1800));
    setTimeout(finish, 4000);
  }

  /* ---------- Navbar: scrolled + hide on scroll-down ---------- */
  function initNav() {
    const nav = document.getElementById('nav');
    const hero = document.getElementById('hero');
    if (!nav) return;
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const heroH = hero ? hero.offsetHeight : window.innerHeight;

      // Solidify after leaving the hero's first viewport
      if (y > window.innerHeight * 0.85) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');

      // Hide on downward scroll, reveal on up — only past the hero
      if (y > heroH && y > lastY + 4) nav.classList.add('is-hidden');
      else if (y < lastY - 4) nav.classList.remove('is-hidden');

      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile menu ---------- */
  function initMobileMenu() {
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('mobileMenu');
    if (!toggle || !menu) return;

    const close = () => {
      menu.classList.remove('is-open');
      menu.setAttribute('aria-hidden', 'true');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    toggle.addEventListener('click', () => {
      const open = menu.classList.toggle('is-open');
      menu.setAttribute('aria-hidden', String(!open));
      toggle.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  }

  /* ---------- Hero: scroll-scrubbed video ----------
     Reliable, simple method: on every scroll update we set video.currentTime
     DIRECTLY from scroll progress. No ticker loop, no targetTime smoothing
     (continuous seeking when idle thrashes the decoder and looks "frozen").
     The video is only ever loaded + paused; currentTime is the only thing touched.

     NOTE: For genuinely smooth scroll-scrubbing the MP4 must be encoded with
     frequent keyframes, otherwise seeks snap to the nearest keyframe and look
     choppy. Recommended re-encode:
       ffmpeg -i hero-section1.mp4 -vf "scale=1920:-2" -c:v libx264 -preset slow \
         -crf 18 -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p \
         -movflags +faststart hero-section1-scrub.mp4
     Then point the <source> at the dense-keyframe file.
  */
  // Prepare a video purely for scrubbing: loaded + paused, never autoplay/loop/play.
  function prepScrubVideo(video) {
    video.loop = false;
    video.muted = true;
    video.autoplay = false;
    video.removeAttribute('autoplay');
    try { video.pause(); video.currentTime = 0; } catch (e) {}
  }

  // Create a pinned, scroll-scrubbed video section. progress 0 = start, 1 = end.
  // Scrolling down advances the video, scrolling up reverses it (native to scroll position).
  function createScrubVideo(opts) {
    const ST = window.ScrollTrigger;
    const video = opts.video;
    const setup = () => {
      ST.create({
        trigger: opts.section,
        start: 'top top',
        end: opts.end || '+=500%',
        pin: true,
        pinSpacing: true,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (opts.onProgress) opts.onProgress(self.progress);
          if (!video.duration) return;
          video.currentTime = self.progress * video.duration; // direct, continuous mapping
        },
      });
      ST.refresh();
    };
    if (video.readyState >= 1) setup();
    else video.addEventListener('loadedmetadata', setup, { once: true });
  }

  // Fallback (no GSAP): tall sticky track, direct currentTime from scroll position.
  function fallbackScrubVideo(opts) {
    const section = opts.section;
    const video = opts.video;
    section.classList.add('is-fallback');
    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const scrollable = section.offsetHeight - window.innerHeight;
      const p = clamp(-rect.top / (scrollable || 1), 0, 1);
      if (opts.onProgress) opts.onProgress(p);
      const d = video.duration;
      if (d && isFinite(d)) {
        try { video.currentTime = p * d; } catch (e) {}
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    if (video.readyState >= 1) update();
    else video.addEventListener('loadedmetadata', update, { once: true });
  }

  /* ---------- Hero + middle showcase: scroll-scrubbed videos ----------
     The video is only ever loaded + paused; currentTime is the only thing touched.
     NOTE: For smooth scroll-scrubbing the MP4 must be encoded with frequent
     keyframes, else seeks snap to the nearest keyframe and look choppy:
       ffmpeg -i in.mp4 -vf "scale=1920:-2" -c:v libx264 -preset slow -crf 18 \
         -g 6 -keyint_min 6 -sc_threshold 0 -pix_fmt yuv420p \
         -movflags +faststart out-scrub.mp4
  */
  function initHero() {
    const hero = document.getElementById('hero');
    const heroContent = document.getElementById('heroContent');
    const heroVideo = document.getElementById('heroVideo');
    const showcase = document.getElementById('showcase');
    const middleVideo = document.getElementById('middleVideo');

    const videos = [heroVideo, middleVideo].filter(Boolean);
    videos.forEach(prepScrubVideo);

    // Continuous headline fade for the hero (linear ramp — no stages/snap points).
    const heroFade = (p) => {
      if (!heroContent) return;
      const fade = clamp(1 - (p - 0.04) / 0.34, 0, 1);
      heroContent.style.opacity = fade.toFixed(3);
      heroContent.style.transform = 'translateY(' + (p * -34).toFixed(1) + 'px)';
    };

    // Reduced motion: hold a single still frame on each video, no pinning.
    if (reduceMotion) {
      videos.forEach((v) => {
        const paint = () => { try { v.currentTime = 0; } catch (e) {} };
        if (v.readyState >= 1) paint();
        else v.addEventListener('loadedmetadata', paint, { once: true });
      });
      return;
    }

    const gsap = window.gsap;
    const ST = window.ScrollTrigger;

    if (gsap && ST) {
      gsap.registerPlugin(ST);
      if (hero && heroVideo) {
        createScrubVideo({ section: hero, video: heroVideo, end: '+=500%', onProgress: heroFade });
      }
      if (showcase && middleVideo) {
        createScrubVideo({ section: showcase, video: middleVideo, end: '+=500%' });
      }
      window.addEventListener('load', () => ST.refresh());
    } else {
      if (hero && heroVideo) fallbackScrubVideo({ section: hero, video: heroVideo, onProgress: heroFade });
      if (showcase && middleVideo) fallbackScrubVideo({ section: showcase, video: middleVideo });
    }
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    const items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      items.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    items.forEach((el) => io.observe(el));
  }

  /* ---------- Before/After slider ---------- */
  function initBeforeAfter() {
    document.querySelectorAll('[data-ba]').forEach((fig) => {
      const before = fig.querySelector('[data-ba-before]');
      const handle = fig.querySelector('[data-ba-handle]');
      const range = fig.querySelector('[data-ba-range]');
      if (!before || !handle || !range) return;

      const set = (v) => {
        const pct = clamp(v, 0, 100);
        before.style.width = pct + '%';
        handle.style.left = pct + '%';
        range.value = pct;
      };

      range.addEventListener('input', () => set(parseFloat(range.value)));

      // Pointer drag anywhere on the figure for a luxe feel
      let dragging = false;
      const fromEvent = (clientX) => {
        const r = fig.getBoundingClientRect();
        set(((clientX - r.left) / r.width) * 100);
      };
      fig.addEventListener('pointerdown', (e) => {
        dragging = true;
        fig.setPointerCapture(e.pointerId);
        fromEvent(e.clientX);
      });
      fig.addEventListener('pointermove', (e) => {
        if (dragging) fromEvent(e.clientX);
      });
      fig.addEventListener('pointerup', () => (dragging = false));
      fig.addEventListener('pointercancel', () => (dragging = false));

      set(50);
    });
  }

  /* ---------- Architectural scroll marker (light sections only) ---------- */
  function initScrollMarker() {
    const marker = document.getElementById('scrollMarker');
    if (!marker) return;
    // Only the light (white/warm-white) sections — never dark, gray, or video sections.
    const lightEls = Array.from(
      document.querySelectorAll('#services, .whychoose, #process, #projects, #financing')
    );
    if (!lightEls.length) return;

    const PAD = 130; // keep the marker clear of the navbar / bottom edge
    const place = () => {
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight - vh;
      const prog = docH > 0 ? clamp(window.scrollY / docH, 0, 1) : 0;
      const y = PAD + prog * (vh - 2 * PAD);
      marker.style.top = y + 'px';

      let over = false;
      for (const el of lightEls) {
        const r = el.getBoundingClientRect();
        if (r.top <= y && r.bottom >= y) { over = true; break; }
      }
      marker.classList.toggle('is-visible', over);
    };

    // Prefer GSAP ScrollTrigger (it polls scroll position every tick and stays in
    // sync with the pinned sections); fall back to scroll events otherwise.
    const ST = window.ScrollTrigger;
    if (ST) {
      ST.create({ trigger: document.body, start: 'top top', end: 'bottom bottom', onUpdate: place, onRefresh: place });
    }
    window.addEventListener('scroll', place, { passive: true });
    window.addEventListener('resize', place, { passive: true });
    place();
  }

  /* ---------- Init (home-only specials; shared chrome lives in site.js) ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initHero();
    initBeforeAfter();
    initScrollMarker();
  });
})();
