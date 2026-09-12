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

  // 10. Founders Section with Interactive Image Insertion Option
  const teamGrid = document.getElementById('teamGrid');
  const fileInput = document.getElementById('founderFileInput');

  function renderTeam() {
    if (!teamGrid) return;
    teamGrid.innerHTML = CLYX_DATA.team.map((m, i) => `
      <div class="founder-card">
        <div>
          <div class="founder-top">
            <div class="founder-avatar-box">
              <div class="founder-avatar-wrap" onclick="triggerFounderPhotoUpload(${i})" title="Click to insert/change photo">
                <img src="${m.img}" alt="${m.name}" class="founder-avatar-img" id="founderImg-${i}">
                <div class="founder-avatar-overlay">📷 Change</div>
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
          <button class="founder-photo-btn" onclick="triggerFounderPhotoUpload(${i})">
            <span>📷 Insert Photo</span>
          </button>
          <span>Direct Advisory ↗</span>
        </div>
      </div>
    `).join('');
  }

  window.triggerFounderPhotoUpload = function(index) {
    activeFounderIndex = index;
    const userChoice = confirm(`Would you like to upload a photo file from your device for ${CLYX_DATA.team[index].name}?\n\n(Click 'OK' to pick a file from your computer, or 'Cancel' to paste an image URL)`);
    if (userChoice) {
      fileInput.click();
    } else {
      const url = prompt(`Paste an image URL for ${CLYX_DATA.team[index].name}:`);
      if (url && url.trim().length > 0) {
        CLYX_DATA.team[index].img = url.trim();
        renderTeam();
      }
    }
  };

  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          CLYX_DATA.team[activeFounderIndex].img = event.target.result;
          renderTeam();
        };
        reader.readAsDataURL(file);
      }
    });
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
});
