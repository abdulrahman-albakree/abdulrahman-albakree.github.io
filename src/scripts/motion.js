// Motion + lazy media. Runs once per page (Astro bundles it as a module).
const root = document.documentElement;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* 1) Split headline text into words (keeps colored spans intact). */
function splitWords(el) {
  let i = 1;
  const walk = (node) => {
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === 3) {
        const parts = child.textContent.split(/(\s+)/);
        if (!parts.some((p) => p.trim())) return;
        const frag = document.createDocumentFragment();
        parts.forEach((p) => {
          if (!p) return;
          if (!p.trim()) { frag.append(p); return; }
          const s = document.createElement('span');
          s.className = 'w';
          s.style.setProperty('--i', i++);
          s.textContent = p;
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1 && !child.matches('svg, .w, [data-nosplit], br')) {
        // inline decorations (svg, pills) animate as one "word"
        if (child.matches('[data-word]')) {
          child.classList.add('w');
          child.style.setProperty('--i', i++);
        } else {
          walk(child);
        }
      } else if (child.nodeType === 1 && child.matches('svg[data-word]')) {
        child.classList.add('w');
        child.style.setProperty('--i', i++);
      }
    });
  };
  walk(el);
}
document.querySelectorAll('.words').forEach(splitWords);

/* 2) Give every floating thing its own rhythm & delay (deterministic pseudo-random). */
const rnd = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };
const ranges = {
  float: [4.6, 7.4], float2: [5.6, 8.2], chip: [3.6, 6], sway: [3.2, 5], drift: [5.5, 8], hfloat: [4.4, 6.2],
};
let n = 0;
Object.entries(ranges).forEach(([cls, [a, b]]) => {
  document.querySelectorAll('.' + cls).forEach((el) => {
    n++;
    if (el.style.getPropertyValue('--fd')) return;
    const d = a + rnd(n) * (b - a);
    el.style.setProperty('--fd', d.toFixed(2) + 's');
    el.style.setProperty('--fdel', (-rnd(n + 99) * d).toFixed(2) + 's');
  });
});

/* 3) Reveal on scroll + headline entrance (once). */
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -2% 0px' });
document.querySelectorAll('.reveal, .words').forEach((el) => io.observe(el));

/* 4) Videos: load only when near, play only while visible. */
const vio = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    const v = e.target;
    if (e.isIntersecting) {
      if (v.dataset.src && !v.src) { v.src = v.dataset.src; v.load(); }
      const p = v.play(); if (p) p.catch(() => {});
    } else if (!v.paused) {
      v.pause();
    }
  });
}, { rootMargin: '200px 0px', threshold: 0.01 });
document.querySelectorAll('video[data-src]').forEach((v) => vio.observe(v));

/* 5) Vimeo click-to-load facade (keeps first load light). */
document.addEventListener('click', (ev) => {
  const btn = ev.target.closest('[data-vimeo]');
  if (!btn) return;
  const id = btn.dataset.vimeo;
  const f = document.createElement('iframe');
  f.src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;
  f.allow = 'autoplay; fullscreen; picture-in-picture';
  f.allowFullscreen = true;
  f.title = btn.getAttribute('aria-label') || 'Vimeo';
  btn.replaceChildren(f);
  btn.removeAttribute('data-vimeo');
  btn.style.cursor = 'default';
  // stop the floating while someone is watching
  btn.closest('.float, .float2')?.style.setProperty('animation-play-state', 'paused');
});

/* 6) Work filters (home). */
const fbar = document.querySelector('[data-filters]');
if (fbar) {
  const cards = document.querySelectorAll('[data-tags]');
  fbar.addEventListener('click', (ev) => {
    const b = ev.target.closest('button[data-f]');
    if (!b) return;
    fbar.querySelectorAll('button').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.f;
    cards.forEach((c) => {
      const on = f === 'all' || c.dataset.tags.split(' ').includes(f);
      c.classList.toggle('is-dim', !on);
    });
  });
}

/* 7) Contact form → WhatsApp / mail (static site, no backend). */
const form = document.querySelector('[data-contact]');
if (form) {
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const msg = `مرحباً عبدالرحمن، أنا ${fd.get('name') || ''}\nللتواصل: ${fd.get('reach') || ''}\n\n${fd.get('idea') || ''}`;
    const wa = form.dataset.wa, mail = form.dataset.mail;
    const note = form.querySelector('[data-note]');
    if (wa) window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    else if (mail) location.href = `mailto:${mail}?subject=${encodeURIComponent('مشروع جديد')}&body=${encodeURIComponent(msg)}`;
    else if (note) note.hidden = false;
  });
}

if (reduce) root.classList.add('reduced');
