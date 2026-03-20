/* ============================================================
   PERSONAL PORTFOLIO — Main JavaScript

   Profile & Resume:  data/profile.json, data/resume.json
   Blog posts:        posts/{slug}.md  (one file per post)
   Blog manifest:     posts/index.json (auto-rebuilt by GitHub Action)
   CMS admin:         /admin/  (Decap CMS — write posts in a browser UI)
   ============================================================ */

'use strict';

/* ── HELPERS ──────────────────────────────────────────────── */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function readingTime(text) {
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 200)) + ' min read';
}

/* Very lightweight Markdown → HTML (covers common cases) */
function simpleMarkdown(md = '') {
  return md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headings
    .replace(/^##### (.+)$/gm, '<h5>$1</h5>')
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Horizontal rule
    .replace(/^---+$/gm, '<hr>')
    // Bold & italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links and images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    // Unordered list items
    .replace(/^\s*[-*+] (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]*?<\/li>)+/g, '<ul>$&</ul>')
    // Ordered list items
    .replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>')
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[hupblicer])(?!$)(.+)$/gm, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/g, '');
}

/* ── THEME ────────────────────────────────────────────────── */
/* Dark-only theme — no user toggle. Palette controlled by admin via profile.json */
function initTheme() {
  document.documentElement.setAttribute('data-theme', 'light');
}

/* ── PALETTE (admin-controlled via profile.json) ─────────── */
function initPalette() {
  /* Default palette applied immediately; loadProfile() will override
     with the admin-configured value from profile.json */
  document.documentElement.setAttribute('data-palette', 'ember');
}

/* ── READING PROGRESS BAR ────────────────────────────────── */
function initProgress() {
  const bar = $('#reading-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrollTop    = window.scrollY;
    const docHeight    = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = scrollPercent + '%';
  }, { passive: true });
}

/* ── NAVBAR ───────────────────────────────────────────────── */
function initNavbar() {
  const navbar     = $('#navbar');
  const hamburger  = $('#hamburger');
  const navLinks   = $('#nav-links');
  const links      = $$('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  links.forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Highlight active section
  const sections = $$('section[id]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(s => observer.observe(s));
}

/* ── BACK TO TOP ──────────────────────────────────────────── */
function initBackToTop() {
  const btn = $('#back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ── REVEAL ON SCROLL ─────────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  $$('.reveal').forEach(el => observer.observe(el));
}

/* ── TYPING ANIMATION ─────────────────────────────────────── */
function startTyping(roles) {
  const el = $('#hero-roles-text');
  if (!el || !roles || roles.length === 0) return;
  let ri = 0, ci = 0, deleting = false;

  function tick() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(tick, deleting ? 60 : 100);
  }
  tick();
}

/* ── SOCIALS BUILDER ──────────────────────────────────────── */
const SOCIAL_ICONS = {
  github:    { icon: 'fab fa-github',    label: 'GitHub' },
  linkedin:  { icon: 'fab fa-linkedin',  label: 'LinkedIn' },
  twitter:   { icon: 'fab fa-twitter',   label: 'Twitter' },
  x:         { icon: 'fab fa-x-twitter', label: 'X' },
  instagram: { icon: 'fab fa-instagram', label: 'Instagram' },
  youtube:   { icon: 'fab fa-youtube',   label: 'YouTube' },
  medium:    { icon: 'fab fa-medium',    label: 'Medium' },
  dev:       { icon: 'fab fa-dev',       label: 'Dev.to' },
  hashnode:  { icon: 'fas fa-blog',      label: 'Hashnode' },
  email:     { icon: 'fas fa-envelope',  label: 'Email' },
  website:   { icon: 'fas fa-globe',     label: 'Website' },
};

function buildSocials(socials = [], className = '') {
  return socials.map(s => {
    const info = SOCIAL_ICONS[s.platform] || { icon: 'fas fa-link', label: s.platform };
    const isEmail = s.platform === 'email';
    const href = isEmail ? `mailto:${s.url}` : s.url;
    const target = isEmail ? '' : ' target="_blank" rel="noopener"';
    return `<a href="${href}"${target} class="social-icon ${className}" title="${info.label}">
              <i class="${info.icon}"></i>
            </a>`;
  }).join('');
}

/* ── LOAD PROFILE ─────────────────────────────────────────── */
async function loadProfile() {
  const data = await fetch('data/profile.json').then(r => r.json());

  // Admin-controlled palette from profile.json
  if (data.palette) {
    document.documentElement.setAttribute('data-palette', data.palette);
  }

  // Page meta
  document.title        = `${data.name} — Portfolio`;
  $('#page-title').textContent = `${data.name} — Portfolio`;

  // Navbar
  $('#nav-name').textContent = data.shortName || data.name.split(' ')[0];

  // Hero
  $('#hero-name').textContent  = data.name;
  $('#hero-bio').textContent   = data.tagline;
  $('#hero-status').textContent = data.status || 'Open to opportunities';

  const avatarImg = $('#avatar-img');
  const initials  = $('#avatar-initials');
  if (data.avatar) {
    avatarImg.style.display = '';   // reset in case onerror fired on empty src
    avatarImg.src = data.avatar;
    avatarImg.alt = data.name;
  } else {
    avatarImg.style.display    = 'none';
    initials.style.display     = 'flex';
    initials.textContent       = data.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }

  // Resume download
  if (data.resumePdf) {
    $('#resume-download').href = data.resumePdf;
    $('#resume-download').style.display = 'inline-flex';
  } else {
    $('#resume-download').style.display = 'none';
  }

  // Socials
  $('#hero-socials').innerHTML   = buildSocials(data.socials);
  $('#footer-socials').innerHTML = buildSocials(data.socials);

  // About
  $('#about-long').textContent = data.about;
  $('#about-highlights').innerHTML = (data.highlights || []).map(h =>
    `<div class="highlight-item reveal"><i class="${h.icon}"></i><span>${h.text}</span></div>`
  ).join('');

  // Stats
  $('#about-stats').innerHTML = (data.stats || []).map(s =>
    `<div class="stat-card reveal"><div class="stat-value">${s.value}</div><div class="stat-label">${s.label}</div></div>`
  ).join('');

  // Footer
  $('#footer-name').textContent     = data.shortName || data.name.split(' ')[0];
  $('#footer-tagline').textContent  = data.footerTagline || data.tagline;
  $('#footer-copyright').textContent = `© ${new Date().getFullYear()} ${data.name}. All rights reserved.`;

  // Contact info
  $('#contact-subtitle').textContent = data.contactSubtitle || 'Have a project in mind or just want to say hi? I\'d love to hear from you.';
  const email = (data.socials || []).find(s => s.platform === 'email');
  if (email) {
    $('#contact-email-link').innerHTML = `<a href="mailto:${email.url}">${email.url}</a>`;
    $('#contact-form').addEventListener('submit', e => {
      e.preventDefault();
      const name    = $('#c-name').value;
      const from    = $('#c-email').value;
      const subject = $('#c-subject').value;
      const body    = $('#c-message').value;
      const mailtoUrl = `mailto:${email.url}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} <${from}>\n\n${body}`)}`;
      // Use a temporary <a> click — more reliable than window.location.href for mailto:
      const a = document.createElement('a');
      a.href = mailtoUrl;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      a.remove();
    });
  }

  $('#contact-info').innerHTML = (data.contactItems || []).map(c => {
    let href = '';
    let clickable = false;
    let isEmail = false;
    const val = c.value || '';
    if (c.label.toLowerCase() === 'email' || c.icon.includes('envelope')) {
      href = `mailto:${val}`;
      clickable = true;
      isEmail = true;
    } else if (c.label.toLowerCase() === 'linkedin' || c.icon.includes('linkedin')) {
      href = val.startsWith('http') ? val : `https://${val}`;
      clickable = true;
    } else if (val.startsWith('http') || val.includes('.com') || val.includes('.org')) {
      href = val.startsWith('http') ? val : `https://${val}`;
      clickable = true;
    }

    const target = isEmail ? '' : ' target="_blank" rel="noopener"';
    const valueHtml = clickable
      ? `<a href="${href}"${target} class="contact-item-link">${val}</a>`
      : val;

    return `<div class="contact-item reveal">
       <div class="contact-item-icon"><i class="${c.icon}"></i></div>
       <div>
         <div class="contact-item-label">${c.label}</div>
         <div class="contact-item-value">${valueHtml}</div>
       </div>
     </div>`;
  }).join('');

  // Beyond Work
  const bw = data.beyondWork;
  if (bw && bw.items && bw.items.length > 0) {
    $('#beyond-work-title').textContent    = bw.title    || 'Beyond Work';
    $('#beyond-work-subtitle').textContent = bw.subtitle || '';
    $('#beyond-work-section').style.display = 'block';
    $('#beyond-work-grid').innerHTML = bw.items.map(item =>
      `<a href="${item.url}" target="_blank" rel="noopener" class="beyond-card reveal">
         <div class="beyond-card-top">
           <span class="beyond-emoji">${item.emoji || '⚖️'}</span>
           <span class="beyond-role">${item.role}</span>
         </div>
         <h4 class="beyond-event">${item.event}</h4>
         ${item.location ? `<div class="beyond-location"><i class="fas fa-map-marker-alt"></i> ${item.location}</div>` : ''}
         <p class="beyond-desc">${item.description}</p>
         <span class="beyond-link">View event <i class="fas fa-arrow-right"></i></span>
       </a>`
    ).join('');
    initBeyondCarousel();
  }

  // Typing animation
  startTyping(data.roles);

  initReveal();
  return data;
}

/* ── BEYOND WORK CAROUSEL ────────────────────────────────── */
function initBeyondCarousel() {
  const grid = $('#beyond-work-grid');
  const prev = $('#beyond-prev');
  const next = $('#beyond-next');
  if (!grid || !prev || !next) return;

  const scrollAmount = () => {
    const card = grid.querySelector('.beyond-card');
    return card ? card.offsetWidth + 16 : 320; // card width + gap
  };

  const updateButtons = () => {
    prev.disabled = grid.scrollLeft <= 2;
    next.disabled = grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 2;
  };

  prev.addEventListener('click', () => {
    grid.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
  });
  next.addEventListener('click', () => {
    grid.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
  });

  grid.addEventListener('scroll', updateButtons, { passive: true });
  // Initial state
  updateButtons();
  // Re-check after cards render
  requestAnimationFrame(updateButtons);
}

/* ── LOAD SKILLS ──────────────────────────────────────────── */
async function loadSkills() {
  const { skills } = await fetch('data/resume.json').then(r => r.json());
  $('#skills-grid').innerHTML = (skills || []).map(cat =>
    `<div class="skill-category reveal">
       <h3>${cat.category}</h3>
       <div class="skill-tags">
         ${(cat.items || []).map(s =>
           `<span class="skill-tag">
              ${s.icon ? `<i class="${s.icon}"></i>` : ''}
              ${s.name}
            </span>`
         ).join('')}
       </div>
     </div>`
  ).join('');
}

/* ── LOAD MEDIA COVERAGE ─────────────────────────────────── */
async function loadMedia() {
  const data = await fetch('data/profile.json').then(r => r.json());
  const media = data.mediaCoverage || [];
  const grid  = $('#media-grid');
  if (!grid || media.length === 0) return;

  grid.innerHTML = media.map(item =>
    `<a href="${item.url}" target="_blank" rel="noopener noreferrer" class="media-card reveal">
       <div class="media-card-icon">
         <i class="${item.icon || 'fas fa-newspaper'}"></i>
       </div>
       <div class="media-card-body">
         <span class="media-outlet">${item.outlet}</span>
         <h4 class="media-title">${item.title}</h4>
         <span class="media-link">Read article <i class="fas fa-arrow-right"></i></span>
       </div>
     </a>`
  ).join('');

  initReveal();
}

/* ── LOAD RESUME ──────────────────────────────────────────── */
async function loadResume() {
  const data = await fetch('data/resume.json').then(r => r.json());

  // Experience
  $('#experience-timeline').innerHTML = (data.experience || []).map(item =>
    `<div class="timeline-item reveal">
       <div class="timeline-dot"></div>
       <div class="timeline-header">
         <div>
           <div class="timeline-role">${item.role}</div>
           <div class="timeline-company">${item.company}${item.location ? ' · ' + item.location : ''}</div>
         </div>
         <span class="timeline-date">${item.from} – ${item.to || 'Present'}</span>
       </div>
       <p class="timeline-desc">${item.description}</p>
       ${item.tags ? `<div class="timeline-tags">${item.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}</div>` : ''}
     </div>`
  ).join('');

  // Education
  $('#education-timeline').innerHTML = (data.education || []).map(item =>
    `<div class="timeline-item reveal">
       <div class="timeline-dot"></div>
       <div class="timeline-header">
         <div>
           <div class="timeline-role">${item.degree}</div>
           <div class="timeline-company">${item.institution}</div>
         </div>
         <span class="timeline-date">${item.from} – ${item.to || 'Present'}</span>
       </div>
       <p class="timeline-desc">${item.description || ''}</p>
       ${item.tags ? `<div class="timeline-tags">${item.tags.map(t => `<span class="timeline-tag">${t}</span>`).join('')}</div>` : ''}
     </div>`
  ).join('');

  // Achievements
  $('#achievements-grid').innerHTML = (data.achievements || []).map(a => {
    const inner = `
      <div class="achievement-icon">${a.emoji || '🏆'}</div>
      <div>
        <h4>${a.title}</h4>
        <p>${a.description}</p>
        <div class="achievement-footer">
          ${a.year ? `<span class="achievement-year">${a.year}</span>` : ''}
          ${a.url  ? `<span class="achievement-url-badge"><i class="fas fa-external-link-alt"></i> View event</span>` : ''}
        </div>
      </div>`;
    return a.url
      ? `<a href="${a.url}" target="_blank" rel="noopener" class="achievement-card achievement-card-link reveal">${inner}</a>`
      : `<div class="achievement-card reveal">${inner}</div>`;
  }).join('');

  // Tabs
  $$('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      $$('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      $(`#tab-${btn.dataset.tab}`).classList.add('active');
      initReveal();
    });
  });
}

/* ── LOAD PROJECTS ────────────────────────────────────────── */
async function loadProjects() {
  const { projects } = await fetch('data/resume.json').then(r => r.json());
  if (!projects || projects.length === 0) return;

  const allTags = [...new Set(projects.flatMap(p => p.tags || []))];

  $('#project-filters').innerHTML =
    `<button class="filter-btn active" data-filter="all">All</button>` +
    allTags.map(t => `<button class="filter-btn" data-filter="${t}">${t}</button>`).join('');

  $('#projects-grid').innerHTML = projects.map(p =>
    `<div class="project-card reveal" data-tags="${(p.tags || []).join(',')}">
       <div class="project-image">
         ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy" />` : p.emoji || '🚀'}
         ${p.featured ? '<span class="project-featured-badge">⭐ Featured</span>' : ''}
       </div>
       <div class="project-body">
         <h3 class="project-title">${p.title}</h3>
         <p class="project-desc">${p.description}</p>
         <div class="project-tags">${(p.tags || []).map(t => `<span class="project-tag">${t}</span>`).join('')}</div>
         <div class="project-links">
           ${p.github  ? `<a href="${p.github}"  target="_blank" rel="noopener" class="project-link"><i class="fab fa-github"></i> Code</a>` : ''}
           ${p.demo    ? `<a href="${p.demo}"    target="_blank" rel="noopener" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>` : ''}
           ${p.article ? `<a href="${p.article}" target="_blank" rel="noopener" class="project-link"><i class="fas fa-file-alt"></i> Article</a>` : ''}
         </div>
       </div>
     </div>`
  ).join('');

  // Filter
  $$('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      $$('.project-card').forEach(card => {
        const tags = card.dataset.tags.split(',');
        card.classList.toggle('hidden', filter !== 'all' && !tags.includes(filter));
      });
    });
  });
}

/* ── FRONTMATTER PARSER ───────────────────────────────────── */
/**
 * Splits a Markdown file into { meta, body }.
 * Handles YAML frontmatter between --- delimiters.
 * Supports: strings, numbers, inline arrays [a, b, c]
 */
function parseFrontmatter(text = '') {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const colon = line.indexOf(':');
    if (colon < 1) return;
    const key   = line.slice(0, colon).trim();
    let   value = line.slice(colon + 1).trim().replace(/^["']|["']$/g, '');
    // Inline array: [item1, "item2"]
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value.slice(1, -1)
        .split(',')
        .map(v => v.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    }
    meta[key] = value;
  });

  return { meta, body: match[2] };
}

/* Fetch + parse a single .md post file */
async function fetchPost(slug) {
  const res = await fetch(`posts/${slug}.md`);
  if (!res.ok) throw new Error(`Post not found: ${slug}`);
  const text = await res.text();
  const { meta, body } = parseFrontmatter(text);
  const tags = Array.isArray(meta.tags)
    ? meta.tags
    : (meta.tags ? meta.tags.split(',').map(t => t.trim()) : []);
  return {
    slug,
    title:      meta.title      || slug,
    date:       meta.date       || '',
    author:     meta.author     || '',
    emoji:      meta.emoji      || '📝',
    coverImage: meta.coverImage || '',
    tags,
    excerpt:    meta.excerpt    || '',
    content:    body,
  };
}

/* ── LOAD BLOG ────────────────────────────────────────────── */
let allPosts = [];

async function loadBlog() {
  // 1. Load the post manifest (auto-rebuilt by GitHub Action on every push)
  const index = await fetch('posts/index.json').then(r => r.json());
  const slugs = (index.posts || []).map(p => p.slug).filter(Boolean);

  // 2. Fetch all .md files in parallel — use index metadata as fast fallback
  const settled = await Promise.allSettled(slugs.map(fetchPost));
  allPosts = settled
    .filter(r => r.status === 'fulfilled')
    .map(r => r.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (allPosts.length === 0) {
    $('#blog-no-results').style.display = 'block';
    return;
  }

  // 3. Build tag filters
  const allTags = [...new Set(allPosts.flatMap(p => p.tags || []))];
  $('#blog-tags').innerHTML =
    `<button class="blog-tag-filter active" data-tag="all">All</button>` +
    allTags.map(t => `<button class="blog-tag-filter" data-tag="${t}">${t}</button>`).join('');

  renderBlog(allPosts);

  // 4. Footer recent posts
  $('#footer-recent-posts').innerHTML = allPosts.slice(0, 4).map(p =>
    `<li><a href="#blog" onclick="openPost('${p.slug}')">${p.title}</a></li>`
  ).join('');

  // 5. Search + tag filtering
  const searchInput = $('#blog-search');
  let activeTag = 'all';

  function filterAndRender() {
    const q = searchInput.value.toLowerCase();
    const filtered = allPosts.filter(p => {
      const matchTag  = activeTag === 'all' || (p.tags || []).includes(activeTag);
      const matchText = !q
        || p.title.toLowerCase().includes(q)
        || (p.excerpt || '').toLowerCase().includes(q)
        || (p.tags || []).some(t => t.toLowerCase().includes(q));
      return matchTag && matchText;
    });
    renderBlog(filtered);
  }

  searchInput.addEventListener('input', filterAndRender);
  $$('.blog-tag-filter').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.blog-tag-filter').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeTag = btn.dataset.tag;
      filterAndRender();
    });
  });
}

function renderBlog(posts) {
  const grid   = $('#blog-grid');
  const noRes  = $('#blog-no-results');

  if (posts.length === 0) {
    grid.innerHTML = '';
    noRes.style.display = 'block';
    return;
  }
  noRes.style.display = 'none';

  grid.innerHTML = posts.map(p => {
    const coverHtml = p.coverImage
      ? `<img src="${p.coverImage}" alt="${p.title}" loading="lazy" />`
      : `<div class="blog-card-cover-gradient">${p.emoji || '📝'}</div>`;

    return `<div class="blog-card reveal" data-slug="${p.slug}" onclick="openPost('${p.slug}')">
      <div class="blog-card-cover">${coverHtml}</div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          ${p.tags && p.tags[0] ? `<span class="blog-card-meta-tag">${p.tags[0]}</span>` : ''}
          <span>${formatDate(p.date)}</span>
        </div>
        <h3 class="blog-card-title">${p.title}</h3>
        <p class="blog-card-excerpt">${p.excerpt}</p>
        <div class="blog-card-footer">
          <span><i class="fas fa-clock"></i> ${readingTime(p.content)}</span>
          <span class="blog-read-more">Read more <i class="fas fa-arrow-right"></i></span>
        </div>
      </div>
    </div>`;
  }).join('');

  initReveal();
}

/* ── BLOG MODAL ───────────────────────────────────────────── */
window.openPost = function(slug) {
  const post = allPosts.find(p => p.slug === slug);
  if (!post) return;

  const coverHtml = post.coverImage
    ? `<img class="modal-cover" src="${post.coverImage}" alt="${post.title}" />`
    : `<div class="modal-cover-emoji">${post.emoji || '📝'}</div>`;

  $('#modal-content').innerHTML = `
    ${coverHtml}
    <span class="modal-tag">${(post.tags && post.tags[0]) || 'Article'}</span>
    <h1 class="modal-title">${post.title}</h1>
    <div class="modal-meta">
      <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
      <span><i class="fas fa-clock"></i> ${readingTime(post.content)}</span>
      ${post.author ? `<span><i class="fas fa-user"></i> ${post.author}</span>` : ''}
    </div>
    <div class="modal-body">${simpleMarkdown(post.content)}</div>
    ${post.tags ? `<div class="modal-tags">${post.tags.map(t => `<span class="blog-card-meta-tag">${t}</span>`).join('')}</div>` : ''}
  `;

  const overlay = $('#blog-modal-overlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  overlay.scrollTop = 0;
};

function closeBlogModal() {
  $('#blog-modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('DOMContentLoaded', () => {
  $('#modal-close').addEventListener('click', closeBlogModal);
  $('#blog-modal-overlay').addEventListener('click', e => {
    if (e.target === $('#blog-modal-overlay')) closeBlogModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeBlogModal();
  });
});

/* ── BOOT ─────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  initPalette();
  initProgress();
  initNavbar();
  initBackToTop();

  // Load all data in parallel
  await Promise.all([
    loadProfile(),
    loadSkills(),
    loadMedia(),
    loadResume(),
    loadProjects(),
    loadBlog(),
  ]);

  initReveal();
});
