// Site data loader.
// The editable data lives in JSON files managed from the dashboard (Pages CMS, see .pages.yml):
//   src/content/works/*.json  -> one file per work
//   src/data/site.json        -> contact info + socials
//   src/data/clients.json     -> client logos
// Do not add numbers, clients or stats that Abdulrahman did not provide.
import siteData from './site.json';
import clientsData from './clients.json';

const files = import.meta.glob('../content/works/*.json', { eager: true, import: 'default' });

const clean = (v) => (typeof v === 'string' ? v.trim() : v);
const list = (v) => (Array.isArray(v) ? v.filter((x) => x !== null && x !== undefined && x !== '') : []);

export const works = Object.entries(files)
  .map(([path, w]) => {
    const slug = clean(w.slug) || path.split('/').pop().replace(/\.json$/, '');
    const orientation = w.orientation === 'h' ? 'h' : 'v';
    const ratio = Number(w.ratio) || (orientation === 'h' ? 16 / 9 : 9 / 16);
    const thumb = clean(w.thumb) || '';
    return {
      ...w,
      slug,
      orientation,
      ratio,
      thumb,
      order: Number(w.order) || 999,
      published: w.published !== false,
      filters: list(w.filters),
      skills: list(w.skills),
      ticker: list(w.ticker).length ? list(w.ticker) : [w.title],
      color: clean(w.color) || '#FFC42E',
      ink: clean(w.ink) || '#151312',
      clip: clean(w.clip) ? { src: clean(w.clip), poster: clean(w.clipPoster) || thumb } : null,
      slides: list(w.slides)
        .filter((s) => s && s.video)
        .map((s) => ({ src: s.video, poster: s.poster || '', w: Number(s.w) || 0, h: Number(s.h) || 0 })),
      gallery: list(w.gallery)
        .filter((s) => s && s.video)
        .map((s) => ({ src: s.video, poster: s.poster || '' })),
      frames: list(w.frames),
    };
  })
  .filter((w) => w.published)
  .sort((a, b) => a.order - b.order);

// empty lists behave like "not set" in the templates
works.forEach((w) => {
  if (!w.slides.length) w.slides = null;
  if (!w.gallery.length) w.gallery = null;
  if (!w.frames.length) w.frames = null;
});

export const clients = list(clientsData.clients);

export const filters = [
  { id: 'all', label: 'الكل' },
  { id: 'ads', label: 'إعلانات' },
  { id: 'stories', label: 'قصص مشاريع' },
  { id: 'ui', label: 'واجهات' },
  { id: 'logos', label: 'شعارات' },
  { id: 'reels', label: 'ريلز' },
];

export const site = {
  name: siteData.name,
  nameEn: siteData.nameEn,
  handle: siteData.handle,
  whatsapp: clean(siteData.whatsapp) || '',
  email: clean(siteData.email) || '',
  socials: list(siteData.socials),
};
