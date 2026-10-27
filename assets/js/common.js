/* Shared helpers: loads the content files and draws the header and footer.
   All text on the site comes from data/site.json and data/projects.json. */

const ICONS = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-5-5l5 5-5 5"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5m5-5l-5 5 5 5"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
  github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57v-2.2c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.83 1.24 1.83 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12 12 0 0 0 12 .3"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88m8.41-18.3A11.82 11.82 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.17-1.24-6.16-3.48-8.4"/></svg>',
  copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15l3-3 3 3 2-2 3 3"/><circle cx="9" cy="9" r="1.4"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1"/><path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1"/></svg>'
};

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const has = (v) => Array.isArray(v) ? v.filter((x) => x && String(x.value ?? x).trim()).length > 0 : !!(v && String(v).trim());
const list = (v) => (Array.isArray(v) ? v : []).map((x) => (typeof x === 'object' && x !== null && 'item' in x ? x.item : x)).filter((x) => x && String(x).trim());

async function loadData() {
  const bust = '?v=' + Date.now();
  const [site, projects] = await Promise.all([
    fetch('data/site.json' + bust).then((r) => r.json()),
    fetch('data/projects.json' + bust).then((r) => r.json())
  ]);
  return { site, projects: projects.projects || [] };
}

function statusBadge(status) {
  const done = /complete/i.test(status || '');
  return `<span class="badge ${done ? 'done' : 'wip'}">${esc(status || 'In progress')}</span>`;
}

function shotPlaceholder(text) {
  return `<div class="shot-placeholder"><div>${ICONS.image}${esc(text || 'Dashboard screenshot coming soon')}</div></div>`;
}

function renderHeader(site, page) {
  const base = page === 'home' ? '' : 'index.html';
  const links = [['Work', '#work'], ['About', '#about'], ['Skills', '#skills'], ['Services', '#services'], ['Contact', '#contact']];
  const cv = has(site.cv)
    ? `<li class="nav-cta"><a class="btn btn-primary btn-small" href="${esc(site.cv)}" target="_blank" rel="noopener" download>${ICONS.download}Download CV</a></li>`
    : `<li class="nav-cta"><a class="btn btn-primary btn-small" href="${base}#contact">Hire me</a></li>`;
  document.getElementById('site-header').innerHTML = `
    <div class="wrap nav">
      <a class="brand" href="${page === 'home' ? '#top' : 'index.html'}" aria-label="${esc(site.name)}, home">
        <span class="brand-mark">${esc(site.initials)}</span>
        <span class="brand-name">${esc(site.short_name)}</span>
      </a>
      <button class="menu-btn" aria-expanded="false" aria-controls="nav-links" aria-label="Open menu">${ICONS.menu}</button>
      <ul class="nav-links" id="nav-links">
        ${links.map(([t, h]) => `<li><a href="${base}${h}" data-section="${h.slice(1)}">${t}</a></li>`).join('')}
        ${cv}
      </ul>
    </div>`;
  const header = document.getElementById('site-header');
  const btn = header.querySelector('.menu-btn');
  const nav = header.querySelector('.nav-links');
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    btn.innerHTML = open ? ICONS.close : ICONS.menu;
  });
  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.innerHTML = ICONS.menu; }
  });
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

function socialLinks(site) {
  const out = [];
  if (has(site.email)) out.push(['Email', 'mailto:' + site.email]);
  if (has(site.linkedin)) out.push(['LinkedIn', site.linkedin]);
  if (has(site.github)) out.push(['GitHub', site.github]);
  if (has(site.whatsapp)) out.push(['WhatsApp', 'https://wa.me/' + String(site.whatsapp).replace(/\D/g, '')]);
  return out;
}

function renderFooter(site, page) {
  const base = page === 'home' ? '' : 'index.html';
  document.getElementById('site-footer').innerHTML = `
    <div class="wrap">
      <div class="foot">
        <div>
          <div class="foot-name">${esc(site.name)}</div>
          <div>${esc(site.title)}. ${esc(site.location)}</div>
        </div>
        <ul class="foot-links">
          ${socialLinks(site).map(([t, h]) => `<li><a href="${esc(h)}" ${h.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>${t}</a></li>`).join('')}
        </ul>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ${esc(site.name)}</span>
        <a href="${base}#top">Back to top</a>
      </div>
    </div>`;
}

function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._h);
  t._h = setTimeout(() => t.classList.remove('show'), 2200);
}

async function copyText(text, msg) {
  try { await navigator.clipboard.writeText(text); toast(msg || 'Copied'); }
  catch (e) { window.prompt('Copy this:', text); }
}

function setMeta(name, content, attr = 'name') {
  let m = document.querySelector(`meta[${attr}="${name}"]`);
  if (!m) { m = document.createElement('meta'); m.setAttribute(attr, name); document.head.appendChild(m); }
  m.setAttribute('content', content);
}
