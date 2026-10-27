/* Home page. Draws every section from data/site.json and data/projects.json. */

(async function () {
  let data;
  try { data = await loadData(); }
  catch (e) {
    document.getElementById('main').innerHTML = '<div class="loading">The portfolio content could not load. Refresh the page to try again.</div>';
    return;
  }
  const { site, projects } = data;
  renderHeader(site, 'home');
  renderFooter(site, 'home');

  const ordered = [...projects.filter((p) => p.featured), ...projects.filter((p) => !p.featured)];
  const spotlight = ordered[0];
  const main = document.getElementById('main');
  main.innerHTML = hero(site, projects) + work(spotlight, ordered) + about(site) + skills(site) + services(site) + contact(site);

  wireProjects(ordered);
  wireContact(site);
  wireNav();
})();

/* ---------- Hero ---------- */
function hero(site, projects) {
  const c = site.hero_chart || {};
  const bars = c.bars || [];
  const max = Math.max(...bars.map((b) => Number(b.value) || 0), 1);
  const cols = 'ABCDEFGH'.split('');
  const rows = Array.from({ length: 30 }, (_, i) => i + 1);
  const photo = has(site.photo)
    ? `<img class="avatar-sm" src="${esc(site.photo)}" alt="${esc(site.name)}">`
    : `<span class="avatar-sm" aria-hidden="true">${esc(site.initials)}</span>`;
  const cv = has(site.cv)
    ? `<a class="btn btn-ghost" href="${esc(site.cv)}" target="_blank" rel="noopener" download>${ICONS.download}Download CV</a>`
    : `<a class="btn btn-ghost" href="#contact">Get in touch</a>`;
  const stats = [{ value: String(projects.length), label: 'analysis projects, from retail sales to public health' }, ...(site.stats || [])];
  return `
  <section class="hero" aria-labelledby="hero-title">
    <div class="wrap">
      <div class="sheet">
        <div class="formula-bar" aria-hidden="true">
          <span class="name-box">B3</span><span class="fx">fx</span>
          <span class="formula">=<span class="fn">ANALYSE</span>(<span class="fn">CLEAN</span>(raw_data))</span>
        </div>
        <div class="col-heads" aria-hidden="true"><span></span>${cols.map((l) => `<span class="${l === 'B' ? 'on' : ''}">${l}</span>`).join('')}</div>
        <div class="sheet-body">
          <div class="row-heads" aria-hidden="true">${rows.map((n) => `<span class="${n === 3 ? 'on' : ''}">${n}</span>`).join('')}</div>
          <div class="grid-area">
            <div class="hero-grid">
              <div class="hero-copy">
                <div class="hello">${photo}
                  <div class="hello-text"><strong>${esc(site.name)}</strong><span>${esc(site.title)}. ${esc(site.location)}</span></div>
                </div>
                <h1 id="hero-title"><span class="cell">${esc(site.headline)}</span></h1>
                <p class="hero-intro">${esc(site.intro)}</p>
                <div class="hero-actions">
                  <a class="btn btn-primary" href="#work">See my projects</a>
                  ${cv}
                </div>
                <div class="status-line"><span class="pulse" aria-hidden="true"></span>${esc(site.availability)}</div>
              </div>
              ${bars.length ? `
              <figure class="chart-object" style="margin:0">
                <span class="handle tl"></span><span class="handle tr"></span><span class="handle bl"></span><span class="handle br"></span>
                <div class="chart-title">${esc(c.title)}</div>
                <div class="chart-sub">Revenue in US dollars, millions</div>
                <div class="bars" role="img" aria-label="${esc(c.title)}: ${bars.map((b) => `${b.label} ${c.prefix || ''}${b.value}${c.suffix || ''}`).join(', ')}">
                  ${bars.map((b, i) => `<div class="bar ${i === bars.length - 1 ? 'last' : ''}"><span class="bar-val">${esc(c.prefix)}${Number(b.value).toFixed(2)}${esc(c.suffix)}</span><span class="bar-fill" style="--h:${((Number(b.value) || 0) / max) * 82}%"></span></div>`).join('')}
                </div>
                <div class="bar-labels" aria-hidden="true">${bars.map((b) => `<span>${esc(b.label)}</span>`).join('')}</div>
                <figcaption class="chart-foot"><span>${esc(c.caption)}</span>${c.project ? `<a href="project.html?p=${encodeURIComponent(c.project)}">Read the case study</a>` : ''}</figcaption>
              </figure>` : ''}
            </div>
          </div>
        </div>
      </div>
      <div class="stats">
        ${stats.map((s) => `<div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join('')}
      </div>
    </div>
  </section>`;
}

/* ---------- Work ---------- */
function work(spot, ordered) {
  const cats = [...new Set(ordered.map((p) => p.category).filter(Boolean))];
  const kpis = (spot && spot.highlights || []).filter((h) => h && h.value).slice(0, 3);
  return `
  <section class="section" id="work" aria-labelledby="work-title">
    <div class="wrap">
      <div class="section-head">
        <div>
          <h2 id="work-title">Selected work</h2>
          <p>Each project starts with a business question and ends with a recommendation. Open any project to see the problem, my process and what I found.</p>
        </div>
      </div>
      ${spot ? `
      <a class="spotlight" href="project.html?p=${encodeURIComponent(spot.slug)}">
        <div class="spotlight-media">
          ${has(spot.image) ? `<img src="${esc(spot.image)}" alt="${esc(spot.image_alt)}" loading="lazy">` : shotPlaceholder('Dashboard screenshot coming soon')}
        </div>
        <div class="spotlight-body">
          <div class="spotlight-kicker"><span class="badge type">Featured project</span>${statusBadge(spot.status)}</div>
          <h3>${esc(spot.title)}</h3>
          <p>${esc(spot.summary)}</p>
          ${kpis.length ? `<div class="mini-kpis">${kpis.map((k) => `<div class="mini-kpi"><b>${esc(k.value)}</b><span>${esc(k.label)}</span></div>`).join('')}</div>` : ''}
          <span class="read-link">Read the case study</span>
        </div>
      </a>` : ''}
      <div class="index-tools">
        <div class="filters" role="group" aria-label="Filter projects">
          <button type="button" aria-pressed="true" data-cat="">All <span class="num">(${ordered.length})</span></button>
          ${cats.map((c) => `<button type="button" aria-pressed="false" data-cat="${esc(c)}">${esc(c)} <span class="num">(${ordered.filter((p) => p.category === c).length})</span></button>`).join('')}
        </div>
        <label class="search"><span class="sr-only">Search projects</span>${ICONS.search}<input type="search" id="project-search" placeholder="Search by tool or topic"></label>
      </div>
      <div class="table" id="project-table">
        <div class="t-head" aria-hidden="true"><span>Project</span><span>Type</span><span>Tools</span><span>Status</span><span></span></div>
        <div id="project-rows"></div>
      </div>
    </div>
  </section>`;
}

function projectRow(p) {
  return `
    <a class="t-row" href="project.html?p=${encodeURIComponent(p.slug)}">
      <div class="t-main"><span class="t-title">${esc(p.short_title || p.title)}</span><span class="t-sum">${esc(p.summary)}</span></div>
      <div class="t-type"><span class="badge type">${esc(p.category)}</span></div>
      <div class="t-tools">${list(p.tools).slice(0, 3).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="t-status">${statusBadge(p.status)}</div>
      <svg class="t-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-5-5l5 5-5 5"/></svg>
    </a>`;
}

function wireProjects(ordered) {
  const rows = document.getElementById('project-rows');
  const search = document.getElementById('project-search');
  let cat = '';
  const draw = () => {
    const q = search.value.trim().toLowerCase();
    const shown = ordered.filter((p) => (!cat || p.category === cat) &&
      (!q || [p.title, p.short_title, p.summary, p.category, ...list(p.tools)].join(' ').toLowerCase().includes(q)));
    rows.innerHTML = shown.length ? shown.map(projectRow).join('') : '<div class="empty">No projects match that search. Try a tool like “Excel” or “Power BI”.</div>';
  };
  document.querySelectorAll('.filters button').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach((x) => x.setAttribute('aria-pressed', 'false'));
    b.setAttribute('aria-pressed', 'true');
    cat = b.dataset.cat;
    draw();
  }));
  search.addEventListener('input', draw);
  draw();
}

/* ---------- About ---------- */
function about(site) {
  const paras = list(site.about);
  return `
  <section class="section" id="about" aria-labelledby="about-title">
    <div class="wrap about-grid">
      <div class="portrait-col">
        <div class="portrait">
          ${has(site.photo) ? `<img src="${esc(site.photo)}" alt="${esc(site.name)}, ${esc(site.title)}" loading="lazy">` : `<div class="portrait-fallback" aria-hidden="true">${esc(site.initials)}</div>`}
        </div>
        <ul class="facts">
          <li><span>Based in</span><span>${esc(site.location)}</span></li>
          <li><span>Education</span><span>${esc(site.education)}</span></li>
          <li><span>Focus</span><span>${list(site.industries).map(esc).join(', ')}</span></li>
        </ul>
      </div>
      <div class="about-text">
        <h2 id="about-title" style="margin-bottom:24px">About me</h2>
        ${paras.map((p) => `<p>${esc(p)}</p>`).join('')}
        <h3 style="margin-top:36px">How I work</h3>
        <ol class="steps">
          ${(site.process || []).map((s) => `<li><b>${esc(s.title)}</b><span>${esc(s.text)}</span></li>`).join('')}
        </ol>
      </div>
    </div>
  </section>`;
}

/* ---------- Skills ---------- */
function skills(site) {
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  return `
  <section class="section" id="skills" aria-labelledby="skills-title">
    <div class="wrap">
      <div class="section-head"><div><h2 id="skills-title">Skills and tools</h2><p>Honest levels, updated as I grow.</p></div></div>
      <div class="skills-grid">
        <div>
          <h3 style="margin-bottom:12px">Tools</h3>
          ${(site.tools || []).map((t) => {
            const lv = Math.max(1, Math.min(4, Number(t.level) || 1));
            return `<div class="tool">
              <span class="tool-name">${esc(t.name)}</span>
              <span class="meter"><span class="meter-cells" aria-hidden="true">${[1, 2, 3, 4].map((n) => `<i class="${n <= lv ? 'on' : ''}"></i>`).join('')}</span>${levels[lv - 1]}</span>
              <span class="tool-detail">${esc(t.detail)}</span>
            </div>`;
          }).join('')}
        </div>
        <div>
          <h3 style="margin-bottom:12px">What I can do with them</h3>
          <ul class="list-plain">${list(site.methods).map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
          ${list(site.learning).length ? `<div class="learning"><h3>Currently learning</h3><ul>${list(site.learning).map((m) => `<li>${esc(m)}</li>`).join('')}</ul></div>` : ''}
        </div>
      </div>
    </div>
  </section>`;
}

/* ---------- Services ---------- */
function services(site) {
  return `
  <section class="section" id="services" aria-labelledby="services-title">
    <div class="wrap">
      <div class="section-head"><div><h2 id="services-title">Freelance services</h2><p>For small businesses, startups and researchers who need clean data and clear answers.</p></div></div>
      <div class="price-list">
        ${(site.services || []).map((s) => `<div class="price-row"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p><span class="price">${esc(s.price)}</span></div>`).join('')}
      </div>
      <div class="services-foot">
        <p>${esc(site.services_note)}</p>
        <a class="btn btn-primary" href="#contact" data-enquiry="Freelance project">Request a quote</a>
      </div>
    </div>
  </section>`;
}

/* ---------- Contact ---------- */
function contact(site) {
  const lines = [];
  if (has(site.email)) lines.push(`<li><button type="button" data-copy="${esc(site.email)}">${ICONS.mail}<span class="addr">${esc(site.email)}</span><small>Copy</small></button></li>`);
  if (has(site.linkedin)) lines.push(`<li><a href="${esc(site.linkedin)}" target="_blank" rel="noopener">${ICONS.linkedin}<span>LinkedIn</span><small>Connect</small></a></li>`);
  if (has(site.github)) lines.push(`<li><a href="${esc(site.github)}" target="_blank" rel="noopener">${ICONS.github}<span>GitHub</span><small>See code</small></a></li>`);
  if (has(site.whatsapp)) lines.push(`<li><a href="https://wa.me/${esc(String(site.whatsapp).replace(/\D/g, ''))}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>WhatsApp</span><small>Message</small></a></li>`);
  return `
  <section class="section" id="contact" aria-labelledby="contact-title">
    <div class="wrap contact-grid">
      <div>
        <h2 id="contact-title">Let's work together</h2>
        <p style="color:var(--muted);margin-top:14px;max-width:46ch">Hiring for a data role, or need help with your data? Send a message and I will get back to you.</p>
        <ul class="contact-lines">${lines.join('')}</ul>
      </div>
      <form class="form" id="contact-form" novalidate>
        <div class="two">
          <div class="field"><label for="f-name">Your name</label><input id="f-name" name="name" autocomplete="name" required><div class="err">Enter your name.</div></div>
          <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" required><div class="err">Enter a valid email address.</div></div>
        </div>
        <div class="field"><label for="f-type">What is it about?</label>
          <select id="f-type" name="enquiry"><option>Job opportunity</option><option>Freelance project</option><option>Something else</option></select>
        </div>
        <div class="field"><label for="f-msg">Message</label><textarea id="f-msg" name="message" required></textarea><div class="err">Write a short message.</div></div>
        <button class="btn btn-primary" type="submit">Send message</button>
        <div class="form-msg" id="form-msg" role="status"></div>
      </form>
    </div>
  </section>`;
}

function wireContact(site) {
  document.querySelectorAll('[data-copy]').forEach((b) => b.addEventListener('click', () => copyText(b.dataset.copy, 'Email address copied')));
  document.querySelectorAll('[data-enquiry]').forEach((a) => a.addEventListener('click', () => { document.getElementById('f-type').value = a.dataset.enquiry; }));

  const form = document.getElementById('contact-form');
  const msg = document.getElementById('form-msg');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'form-msg';
    let ok = true;
    form.querySelectorAll('[required]').forEach((el) => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.closest('.field').classList.toggle('invalid', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    const fd = Object.fromEntries(new FormData(form));
    const btn = form.querySelector('button[type="submit"]');

    if (has(site.formspree_id)) {
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const r = await fetch('https://formspree.io/f/' + encodeURIComponent(site.formspree_id), {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...fd, _subject: `Portfolio: ${fd.enquiry} from ${fd.name}` })
        });
        if (!r.ok) throw new Error();
        form.reset();
        msg.className = 'form-msg ok'; msg.textContent = 'Message sent. Thank you, I will reply soon.';
      } catch (err) {
        msg.className = 'form-msg bad'; msg.textContent = `The message did not send. Email me directly at ${site.email}.`;
      } finally { btn.disabled = false; btn.textContent = 'Send message'; }
    } else {
      const subject = `Portfolio: ${fd.enquiry} from ${fd.name}`;
      const body = `${fd.message}\n\n${fd.name}\n${fd.email}`;
      window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      msg.className = 'form-msg ok'; msg.textContent = 'Your email app should open with the message ready. Press send there to finish.';
    }
  });
  form.querySelectorAll('input, textarea').forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.remove('invalid')));
}

/* ---------- Active link in the menu ---------- */
function wireNav() {
  const links = [...document.querySelectorAll('.nav-links a[data-section]')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((l) => l.classList.toggle('active', l.dataset.section === en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['work', 'about', 'skills', 'services', 'contact'].forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}
