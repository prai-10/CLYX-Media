/**
 * CLYX MEDIA - APPLICATION LOGIC
 * Theme switcher, 3D laptop tilt, pop-up campaigns carousel, cursor, and photo upload
 */
let activeFounderIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Theme Toggle with Light Mode Royal Blue Styling
  const toggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeLabel = document.getElementById('themeLabel');
  
  let currentTheme = localStorage.getItem('clyx_standalone_theme') || 'dark';
  applyTheme(currentTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light';
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark';
    }
    localStorage.setItem('clyx_standalone_theme', theme);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  // 2. Preloader
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('loaded'), 700);
  }

  // 3. Cursor
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (dot && ring && window.innerWidth >= 1024) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;
    let hasMoved = false;
    window.addEventListener('mousemove', (e) => {
      if (!hasMoved) {
        hasMoved = true;
        dot.classList.add('active');
        ring.classList.add('active');
      }
      mouseX = e.clientX; mouseY = e.clientY;
      dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`;
    });
    document.addEventListener('mouseleave', () => {
      dot.classList.remove('active');
      ring.classList.remove('active');
    });
    document.addEventListener('mouseenter', () => {
      if (hasMoved) {
        dot.classList.add('active');
        ring.classList.add('active');
      }
    });
    function renderRing() {
      ringX += (mouseX - ringX) * 0.15; ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    renderRing();
    document.querySelectorAll('a, button, .portfolio-card, .founder-card').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 4. Parallax Hero Clips
  const stack = document.getElementById('clipStack');
  if (stack) {
    const cards = stack.querySelectorAll('.clip-card');
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      cards.forEach((card, idx) => {
        const depth = parseFloat(card.getAttribute('data-depth')) || 0.05;
        const moveX = x * depth * 70; const moveY = y * depth * 70;
        const baseRot = (idx % 2 === 0 ? -1 : 1) * (idx * 3 + 2);
        card.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${baseRot}deg)`;
      });
    });
  }

  // 5. 3D Macbook Scroll Perspective
  const section = document.querySelector('.kinetic-section');
  const macbook = document.querySelector('.macbook-container');
  const badges = document.querySelectorAll('.floating-badge');
  if (section && macbook) {
    function onScroll() {
      const rect = section.getBoundingClientRect();
      const totalDistance = section.offsetHeight - window.innerHeight;
      let progress = Math.max(0, Math.min(1, -rect.top / totalDistance));
      const rotateX = 26 * (1 - progress);
      const scale = 0.88 + (0.12 * progress);
      const translateY = (1 - progress) * 35;
      macbook.style.transform = `rotateX(${rotateX.toFixed(2)}deg) scale(${scale.toFixed(3)}) translateY(${translateY.toFixed(1)}px)`;
      badges.forEach((b, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        b.style.transform = `translate3d(${(1 - progress) * 45 * dir}px, ${(1 - progress) * 25}px, 0)`;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 6. Live Oscillating Chart Bars
  setInterval(() => {
    document.querySelectorAll('.chart-bar').forEach(bar => {
      const current = parseInt(bar.style.height || '70', 10);
      const next = Math.max(25, Math.min(95, current + (Math.random() * 10 - 5)));
      bar.style.height = `${next}%`;
    });
  }, 2400);

  // 7. Counters (Count from 0)
  const counters = document.querySelectorAll('.counter');
  if (counters.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startCounting(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    counters.forEach(c => observer.observe(c));

    function startCounting(el) {
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
      const duration = 1800;
      let start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        const p = Math.min((timestamp - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        const val = target * ease;
        el.textContent = `${prefix}${val.toFixed(decimals)}${suffix}`;
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
      }
      requestAnimationFrame(step);
    }
  }

  // 8. Horizontal Scrollable Campaigns (Pop-Up Magnification on Scroll + Drag + Wheel + Arrows)
  const grid = document.getElementById('portfolioGrid');
  const tabs = document.querySelectorAll('.filter-tab');
  const prevBtn = document.getElementById('portfolioPrevBtn');
  const nextBtn = document.getElementById('portfolioNextBtn');

  if (grid) {
    let isDown = false;
    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    function updateActiveCard() {
      const cards = grid.querySelectorAll('.portfolio-card');
      if (!cards.length) return;
      const gridRect = grid.getBoundingClientRect();
      const centerPoint = gridRect.left + gridRect.width / 2;

      let closest = null;
      let minDiff = Infinity;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const diff = Math.abs(centerPoint - cardCenter);
        if (diff < minDiff) {
          minDiff = diff;
          closest = card;
        }
      });

      cards.forEach(card => {
        if (card === closest) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }

    grid.addEventListener('scroll', () => {
      requestAnimationFrame(updateActiveCard);
    }, { passive: true });

    function renderPortfolio(filter) {
      const items = filter === 'all' ? CLYX_DATA.portfolio : CLYX_DATA.portfolio.filter(p => p.category === filter);
      grid.innerHTML = items.map(p => `
        <article class="portfolio-card" data-id="${p.id}" onclick="handleCardClick('${p.id}')">
          <div class="portfolio-media">
            <img src="${p.heroImg}" alt="${p.title}" loading="lazy">
            <div class="portfolio-badge-roas">${p.results.roas} ROAS</div>
          </div>
          <div class="portfolio-info">
            <p class="cat">${p.categoryName} · ${p.deliverables}</p>
            <h3>${p.title}</h3>
            <p class="summary-text">${p.summary}</p>
            <div class="portfolio-metrics-row">
              <div class="metric-item"><span class="metric-val">${p.results.roas}</span><span class="metric-lbl">ROAS</span></div>
              <div class="metric-item"><span class="metric-val">${p.results.revenue}</span><span class="metric-lbl">Revenue</span></div>
              <div class="metric-item"><span class="metric-val">${p.results.cpa}</span><span class="metric-lbl">CPA</span></div>
            </div>
          </div>
        </article>
      `).join('');
      grid.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(updateActiveCard, 100);
    }
    renderPortfolio('all');

    tabs.forEach(t => t.addEventListener('click', () => {
      tabs.forEach(tab => tab.classList.remove('active'));
      t.classList.add('active');
      renderPortfolio(t.getAttribute('data-filter'));
    }));

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        grid.scrollBy({ left: -360, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        grid.scrollBy({ left: 360, behavior: 'smooth' });
      });
    }

    // Mouse Drag-to-Scroll
    grid.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = false;
      startX = e.pageX;
      startScrollLeft = grid.scrollLeft;
      grid.classList.add('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      const diff = e.pageX - startX;
      if (Math.abs(diff) > 5) {
        isDragging = true;
      }
      grid.scrollLeft = startScrollLeft - diff;
    });

    window.addEventListener('mouseup', () => {
      if (isDown) {
        isDown = false;
        grid.classList.remove('grabbing');
      }
    });

    // Mouse Wheel to Horizontal Carousel Scroll
    grid.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const canScrollLeft = grid.scrollLeft > 0 && e.deltaY < 0;
        const canScrollRight = grid.scrollLeft < (grid.scrollWidth - grid.clientWidth - 4) && e.deltaY > 0;
        if (canScrollLeft || canScrollRight) {
          e.preventDefault();
          grid.scrollBy({ left: e.deltaY * 1.3, behavior: 'auto' });
        }
      }
    }, { passive: false });

    window.handleCardClick = function(id) {
      if (isDragging) return;
      openModal(id);
    };
  }

  // 9. Case Study Modal
  window.openModal = function(id) {
    const p = CLYX_DATA.portfolio.find(item => item.id === id);
    const backdrop = document.getElementById('modalBackdrop');
    if (!p || !backdrop) return;
    document.getElementById('modalMedia').innerHTML = `<img src="${p.heroImg}" style="width:100%; height:320px; object-fit:cover; border-radius:12px; margin-bottom:24px;">`;
    document.getElementById('modalClient').textContent = p.categoryName;
    document.getElementById('modalCampaign').textContent = p.title;
    document.getElementById('modalResults').innerHTML = `
      <p style="font-size:1.1rem; line-height:1.6; margin-bottom:20px; font-weight:600;">${p.summary}</p>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px; margin:20px 0;">
        <div style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-subtle);"><strong style="color:var(--clyx-yellow); font-size:0.85rem;">CHALLENGE</strong><p style="font-size:0.9rem; margin-top:4px;">${p.problem}</p></div>
        <div style="background:var(--bg-card); padding:16px; border-radius:10px; border:1px solid var(--border-subtle);"><strong style="color:var(--clyx-yellow); font-size:0.85rem;">STRATEGY</strong><p style="font-size:0.9rem; margin-top:4px;">${p.strategy}</p></div>
      </div>
    `;
    document.getElementById('modalMetrics').innerHTML = `
      <div style="display:flex; justify-content:space-around; padding-top:20px; border-top:1px solid var(--border-subtle);">
        <div style="text-align:center;"><div style="font-size:1.6rem; font-weight:800; color:var(--clyx-yellow);">${p.results.roas}</div><div style="font-size:0.75rem;">ROAS</div></div>
        <div style="text-align:center;"><div style="font-size:1.6rem; font-weight:800;">${p.results.revenue}</div><div style="font-size:0.75rem;">REVENUE</div></div>
        <div style="text-align:center;"><div style="font-size:1.6rem; font-weight:800;">${p.results.cpa}</div><div style="font-size:0.75rem;">CPA</div></div>
      </div>
    `;
    backdrop.classList.add('open');
  };
  const closeBtn = document.getElementById('modalClose');
  if (closeBtn) closeBtn.addEventListener('click', () => document.getElementById('modalBackdrop').classList.remove('open'));
  document.getElementById('modalBackdrop').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalBackdrop')) document.getElementById('modalBackdrop').classList.remove('open');
  });

  // 10. Founders / Leadership Section
  const teamGrid = document.getElementById('teamGrid');

  function renderTeam() {
    if (!teamGrid) return;
    teamGrid.innerHTML = CLYX_DATA.team.map((m) => `
      <div class="founder-card" id="founder-${m.monogram.toLowerCase()}">
        <div>
          <div class="founder-top">
            <div class="founder-avatar-box">
              <div class="founder-avatar-wrap">
                <img src="${m.img}" alt="${m.name}" class="founder-avatar-img" loading="lazy">
              </div>
              <div>
                <span class="founder-track-badge">${m.badge}</span>
              </div>
            </div>
          </div>
          <h3>${m.name}</h3>
          <p class="role">${m.role}</p>
          <p class="founder-bio">${m.bio}</p>
        </div>
        <div class="founder-footer">
          <span class="founder-firm-tag">CLYX Leadership</span>
          <a href="#contact" class="founder-advisory-link">Direct Advisory ↗</a>
        </div>
      </div>
    `).join('');
  }

  renderTeam();

  // 11. Testimonials Rendering
  const tTrack = document.getElementById('testimonialTrack');
  if (tTrack) {
    const cards = CLYX_DATA.testimonials.map(t => `
      <div class="testimonial-card">
        <p class="testimonial-quote">“${t.quote}”</p>
        <div class="testimonial-meta">
          <div class="author">${t.author}</div>
          <div class="brand">${t.role}, ${t.brand} · <span>${t.metrics}</span></div>
        </div>
      </div>
    `).join('');
    tTrack.innerHTML = cards + cards;
  }

  // 12. Blog Rendering
  const blogGrid = document.getElementById('blogGrid');
  if (blogGrid && CLYX_DATA.blog) {
    blogGrid.innerHTML = CLYX_DATA.blog.map(b => `
      <article class="blog-card" id="${b.id}">
        <div class="blog-thumb-wrap">
          <img src="${b.img}" alt="${b.title}" loading="lazy">
        </div>
        <div class="blog-card-body">
          <div class="blog-meta-row">
            <span class="blog-tag">${b.category}</span>
            <span>${b.readTime} · ${b.date}</span>
          </div>
          <h3>${b.title}</h3>
          <p>${b.summary}</p>
          <a href="#blog" class="blog-read-link">Read Article →</a>
        </div>
      </article>
    `).join('');
  }

  // 13. Careers Rendering
  const careersGrid = document.getElementById('careersGrid');
  if (careersGrid && CLYX_DATA.careers) {
    careersGrid.innerHTML = CLYX_DATA.careers.map(c => `
      <div class="career-card">
        <div>
          <div class="career-top-meta">
            <span class="career-tag">${c.tag}</span>
            <span class="career-type">${c.type}</span>
          </div>
          <h3>${c.title}</h3>
          <div class="career-loc">📍 ${c.location}</div>
          <p>${c.description}</p>
        </div>
        <div>
          <div class="career-comp">💰 ${c.compensation}</div>
          <a href="mailto:careers@clyxmedia.com?subject=Application for ${encodeURIComponent(c.title)}" class="btn btn-ghost btn-small" style="width:100%;">Apply Now ↗</a>
        </div>
      </div>
    `).join('');
  }

  // 14. Interactive Right-Aligned Search Widget
  const searchToggle = document.getElementById('searchToggle');
  const searchDropdown = document.getElementById('searchDropdown');
  const searchInput = document.getElementById('searchInput');
  const searchClear = document.getElementById('searchClear');
  const searchResults = document.getElementById('searchResults');
  const searchQuickTags = document.getElementById('searchQuickTags');

  function openSearch() {
    if (!searchDropdown) return;
    searchDropdown.classList.add('open');
    if (searchToggle) searchToggle.classList.add('active');
    if (searchInput) {
      setTimeout(() => searchInput.focus(), 60);
    }
    renderSearchResults(searchInput ? searchInput.value.trim() : '');
  }

  function closeSearch() {
    if (!searchDropdown) return;
    searchDropdown.classList.remove('open');
    if (searchToggle) searchToggle.classList.remove('active');
  }

  if (searchToggle) {
    searchToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (searchDropdown && searchDropdown.classList.contains('open')) {
        closeSearch();
      } else {
        openSearch();
      }
    });
  }

  if (searchDropdown) {
    searchDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  document.addEventListener('click', (e) => {
    if (searchDropdown && searchDropdown.classList.contains('open')) {
      if (!searchDropdown.contains(e.target) && e.target !== searchToggle && !searchToggle.contains(e.target)) {
        closeSearch();
      }
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchDropdown && searchDropdown.classList.contains('open')) {
      closeSearch();
    }
  });

  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchClear.classList.remove('visible');
        renderSearchResults('');
        searchInput.focus();
      }
      filterPageCards('');
    });
  }

  if (searchQuickTags) {
    searchQuickTags.querySelectorAll('.search-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query');
        if (searchInput && query) {
          searchInput.value = query;
          if (searchClear) searchClear.classList.add('visible');
          renderSearchResults(query);
          filterPageCards(query);
        }
      });
    });
  }

  function filterPageCards(q) {
    const term = (q || '').toLowerCase().trim();
    document.querySelectorAll('.service-card, .portfolio-card, .founder-card, .blog-card, .career-card').forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = (!term || text.includes(term)) ? '' : 'none';
    });
  }

  function highlightAndScrollTo(targetSelector, csIndex = null) {
    closeSearch();
    if (csIndex !== null && typeof window.openModal === 'function') {
      window.openModal(csIndex);
      return;
    }
    const target = document.querySelector(targetSelector);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.remove('search-highlight-pulse');
      void target.offsetWidth;
      target.classList.add('search-highlight-pulse');
      setTimeout(() => target.classList.remove('search-highlight-pulse'), 1800);
    }
  }

  window.clyxNavigateSearch = function(selector, csIndex) {
    highlightAndScrollTo(selector, csIndex !== null ? parseInt(csIndex, 10) : null);
  };

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
  }

  function renderSearchResults(query) {
    if (!searchResults) return;
    const q = (query || '').toLowerCase().trim();
    if (searchClear) {
      if (q.length > 0) searchClear.classList.add('visible');
      else searchClear.classList.remove('visible');
    }

    if (!q) {
      searchResults.innerHTML = `
        <div class="search-empty-state">
          Type to search case studies, services, creators, articles, and open careers.
        </div>
      `;
      return;
    }

    const matches = [];

    // Search Services
    if (window.CLYX_DATA && CLYX_DATA.services) {
      CLYX_DATA.services.forEach(s => {
        if (s.title.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q)) {
          matches.push({
            badge: 'Service',
            title: s.title,
            desc: s.desc,
            selector: '#services'
          });
        }
      });
    }

    // Search Portfolio / Case Studies
    if (window.CLYX_DATA && CLYX_DATA.portfolio) {
      CLYX_DATA.portfolio.forEach((p, idx) => {
        if (p.client.toLowerCase().includes(q) || p.campaign.toLowerCase().includes(q) || p.results.toLowerCase().includes(q)) {
          matches.push({
            badge: 'Case Study',
            title: `${p.client} — ${p.campaign}`,
            desc: p.results,
            selector: '#portfolio',
            csIndex: idx
          });
        }
      });
    }

    // Search Leadership
    if (window.CLYX_DATA && CLYX_DATA.team) {
      CLYX_DATA.team.forEach(t => {
        if (t.name.toLowerCase().includes(q) || t.role.toLowerCase().includes(q) || t.bio.toLowerCase().includes(q)) {
          matches.push({
            badge: 'Leadership',
            title: `${t.name} (${t.role})`,
            desc: t.bio,
            selector: '#about'
          });
        }
      });
    }

    // Search Blog
    if (window.CLYX_DATA && CLYX_DATA.blog) {
      CLYX_DATA.blog.forEach(b => {
        if (b.title.toLowerCase().includes(q) || b.excerpt.toLowerCase().includes(q)) {
          matches.push({
            badge: 'Blog',
            title: b.title,
            desc: b.excerpt,
            selector: '#blog'
          });
        }
      });
    }

    // Search Careers
    if (window.CLYX_DATA && CLYX_DATA.careers) {
      CLYX_DATA.careers.forEach(c => {
        if (c.title.toLowerCase().includes(q) || c.dept.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) {
          matches.push({
            badge: 'Career',
            title: `${c.title} · ${c.type}`,
            desc: c.desc,
            selector: '#careers'
          });
        }
      });
    }

    if (matches.length === 0) {
      searchResults.innerHTML = `
        <div class="search-empty-state">
          No matches found for "<strong>${escapeHtml(query)}</strong>". Try "Whitelisting", "Meta Ads", "TikTok", or "Careers".
        </div>
      `;
      return;
    }

    searchResults.innerHTML = matches.slice(0, 6).map(m => `
      <div class="search-result-item" onclick="clyxNavigateSearch('${m.selector}', ${m.csIndex !== undefined ? m.csIndex : 'null'})">
        <span class="search-result-badge">${m.badge}</span>
        <div class="search-result-content">
          <div class="search-result-title">${escapeHtml(m.title)}</div>
          <div class="search-result-desc">${escapeHtml(m.desc)}</div>
        </div>
        <span style="color: var(--text-muted); font-size: 0.9rem;">↗</span>
      </div>
    `).join('');
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value;
      renderSearchResults(q);
      filterPageCards(q);
    });
  }

  // 15. Mobile Burger Toggle
  const navBurger = document.getElementById('navBurger');
  const mobileNav = document.getElementById('mobileNav');
  if (navBurger && mobileNav) {
    navBurger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => mobileNav.classList.remove('open'));
    });
  }

  // 16. Cookie Consent Card (Accept All & Essential Only)
  const cookieBar = document.getElementById('cookieBar');
  const cookieAcceptAll = document.getElementById('cookieAcceptAll') || document.getElementById('cookieAccept');
  const cookieEssential = document.getElementById('cookieEssential') || document.getElementById('cookieDecline');
  if (cookieBar) {
    const consent = localStorage.getItem('clyx_cookie_consent');
    if (consent) {
      cookieBar.classList.add('hidden');
    }
    if (cookieAcceptAll) {
      cookieAcceptAll.addEventListener('click', () => {
        localStorage.setItem('clyx_cookie_consent', 'all');
        cookieBar.classList.add('hidden');
      });
    }
    if (cookieEssential) {
      cookieEssential.addEventListener('click', () => {
        localStorage.setItem('clyx_cookie_consent', 'essential');
        cookieBar.classList.add('hidden');
      });
    }
  }

  // 17. Newsletter Form Feedback
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        alert(`Thank you for subscribing! We've sent a confirmation to ${input.value}`);
        input.value = '';
      }
    });
  }
});
