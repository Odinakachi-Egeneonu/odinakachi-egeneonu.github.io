/* Case study page: project.html?p=<project slug> */

(async function () {
  const main = document.getElementById('main');
  let data;
  try { data = await loadData(); }
  catch (e) { main.innerHTML = '<div class="loading">This case study could not load. Refresh the page to try again.</div>'; return; }
  const { site, projects } = data;
  renderHeader(site, 'project');
  renderFooter(site, 'project');

  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  const slug = new URLSearchParams(location.search).get('p');
  const i = ordered.findIndex((p) => p.slug === slug);
  if (i < 0) {
    main.innerHTML = `<div class="wrap" style="padding:96px 24px"><h1 style="font-size:2rem">That project could not be found</h1><p style="margin-top:12px;color:var(--muted)">The link may be out of date.</p><a class="btn btn-primary" href="index.html#work">See all projects</a></div>`;
    return;
  }
  const p = ordered[i];
  const prev = ordered[(i - 1 + ordered.length) % ordered.length];
  const next = ordered[(i + 1) % ordered.length];

  document.title = `${p.short_title || p.title} | ${site.name}, ${site.title}`;
  setMeta('description', p.summary || '');
  setMeta('og:title', `${p.title} | ${site.name}`, 'property');
  setMeta('og:description', p.summary || '', 'property');
  if (has(p.image)) setMeta('og:image', p.image, 'property');

  const section = (title, body) => `<section class="cs-section"><h2>${title}</h2>${body}</section>`;
  const ul = (items, cls) => `<ul class="cs-list ${cls}">${items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
  const questions = list(p.questions), did = list(p.did), findings = list(p.findings), takeaway = list(p.takeaway);
  const kpis = (p.highlights || []).filter((h) => h && h.value);
  const links = (p.links || []).filter((l) => l && has(l.url));
  const writeupPending = !findings.length;

  main.innerHTML = `
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="index.html#work">${ICONS.back}All projects</a></nav>
      <header class="cs-head">
        <div class="spotlight-kicker"><span class="badge type">${esc(p.category)}</span>${statusBadge(p.status)}</div>
        <h1>${esc(p.title)}</h1>
        <p class="lede">${esc(p.summary)}</p>
      </header>

      <figure class="cs-figure">
        ${has(p.image)
          ? `<button type="button" id="zoom" aria-label="Enlarge dashboard image"><img src="${esc(p.image)}" alt="${esc(p.image_alt || p.title)}"></button>`
          : `<div class="ph">${shotPlaceholder('Dashboard screenshot coming soon')}</div>`}
        <figcaption><span>${esc(p.title)}</span>${has(p.image) ? '<span>Select the image to enlarge it</span>' : ''}</figcaption>
      </figure>

      <div class="cs-layout">
        <article>
          ${has(p.note) ? `<p class="note" style="margin-bottom:32px">${esc(p.note)}</p>` : ''}
          ${has(p.problem) ? section('Problem statement', `<p>${esc(p.problem)}</p>`) : ''}
          ${questions.length ? section('Business questions', ul(questions, 'q')) : ''}
          ${did.length ? section('What I did', ul(did, 'do')) : ''}
          ${findings.length ? section('Key findings', ul(findings, 'find')) : ''}
          ${takeaway.length ? section('Business takeaway', `<div class="takeaway">${ul(takeaway, 'act')}</div>`) : ''}
          ${writeupPending ? `<div class="pending">The full write-up for this project, including findings and recommendations, is being added. Check back soon, or <a href="index.html#contact">ask me about it</a>.</div>` : ''}
        </article>

        <aside class="aside" aria-label="Project details">
          ${kpis.length ? `<div class="panel"><h2>In numbers</h2><div class="kpi-stack">${kpis.map((k) => `<div><b>${esc(k.value)}</b><span>${esc(k.label)}</span></div>`).join('')}</div></div>` : ''}
          <div class="panel">
            <h2>At a glance</h2>
            <dl>
              ${has(p.dataset) ? `<dt>Dataset</dt><dd>${esc(p.dataset)}</dd>` : ''}
              <dt>Tools</dt><dd><div class="t-tools">${list(p.tools).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div></dd>
              <dt>Status</dt><dd>${esc(p.status)}</dd>
            </dl>
            ${links.map((l) => `<a class="btn btn-ghost btn-small" href="${esc(l.url)}" target="_blank" rel="noopener">${ICONS.link}${esc(l.label || 'Open link')}</a>`).join('')}
            <button class="btn btn-ghost btn-small" type="button" id="share">${ICONS.copy}Copy link to this project</button>
          </div>
        </aside>
      </div>

      <nav class="pager" aria-label="More projects">
        <a href="project.html?p=${encodeURIComponent(prev.slug)}"><small>Previous project</small><b>${esc(prev.short_title || prev.title)}</b></a>
        <a class="next" href="project.html?p=${encodeURIComponent(next.slug)}"><small>Next project</small><b>${esc(next.short_title || next.title)}</b></a>
      </nav>
    </div>`;

  document.getElementById('share').addEventListener('click', () => copyText(location.href, 'Link copied'));

  const zoom = document.getElementById('zoom');
  const lb = document.getElementById('lightbox');
  if (zoom) {
    const close = () => { lb.classList.remove('open'); zoom.focus(); };
    zoom.addEventListener('click', () => {
      const img = lb.querySelector('img');
      img.src = p.image; img.alt = p.image_alt || p.title;
      lb.classList.add('open'); lb.querySelector('button').focus();
    });
    lb.addEventListener('click', (e) => { if (e.target !== lb.querySelector('img')) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
  }
})();
