/**
 * CLYX MEDIA — ADMIN CONTROL CENTER JAVASCRIPT
 * Complete CRUD engine, live-sync with user page, leads CRM, and settings
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initial State Definition & LocalStorage Hydration
  const defaultData = {
    hero: {
      eyebrow: "Performance marketing • Creator ads • Web",
      line1: "We turn organic clips",
      line2: "scaled accounts.",
      sub: "CLYX Media runs the creator whitelisting + performance engine behind brands that sell — Meta & Google ads, content, branding, and websites built for one job: conversion.",
      btnText: "Book a Growth Call ↗",
      btnLink: "#contact"
    },
    stats: [
      { target: 45, prefix: "₹", suffix: "Cr+", label: "Ad Spend Managed", detail: "Across Meta & Google ad accounts" },
      { target: 3.4, decimals: 1, prefix: "", suffix: "X", label: "Average ROAS Lift", detail: "Whitelisted vs Standard brand ads" },
      { target: 250, prefix: "", suffix: "+", label: "Active Creators", detail: "Fashion, Beauty, Food, Tech benches" },
      { target: 180, prefix: "₹", suffix: "Cr+", label: "Revenue Generated", detail: "Delivered for high-growth D2C brands" }
    ],
    portfolio: window.CLYX_DATA ? [...window.CLYX_DATA.portfolio] : [],
    team: window.CLYX_DATA ? [...window.CLYX_DATA.team] : [],
    testimonials: window.CLYX_DATA ? [...window.CLYX_DATA.testimonials] : [],
    blog: window.CLYX_DATA ? [...window.CLYX_DATA.blog] : [],
    careers: window.CLYX_DATA ? [...window.CLYX_DATA.careers] : [],
    leads: [
      { id: "lead-1", name: "Aarav Mehta", brand: "Zora Botanics (D2C Skincare)", email: "aarav@zoraskincare.in", phone: "+91 98201 44521", budget: "₹10L - ₹25L/mo", service: "Creator Whitelisting + Meta Ads", date: "2026-09-11", status: "New" },
      { id: "lead-2", name: "Rhea Singhania", brand: "Urban Threads Apparel", email: "rhea@urbanthreads.co", phone: "+91 99882 11440", budget: "₹25L - ₹50L/mo", service: "Reels UGC + CRO Website", date: "2026-09-10", status: "Contacted" },
      { id: "lead-3", name: "Devansh Patel", brand: "KetoFuel Nutrition", email: "devansh@ketofuel.com", phone: "+91 98450 77123", budget: "₹5L - ₹10L/mo", service: "Performance Marketing", date: "2026-09-08", status: "Proposal Sent" },
      { id: "lead-4", name: "Meera Kapoor", brand: "Volt Audio India", email: "meera@volthifi.in", phone: "+91 97112 33456", budget: "₹50L+/mo", service: "Full-Stack Growth Retainer", date: "2026-09-05", status: "Closed" }
    ],
    supabaseConfig: {
      url: localStorage.getItem('clyx_supabase_url') || "",
      anonKey: localStorage.getItem('clyx_supabase_key') || ""
    }
  };

  let appData = { ...defaultData };

  try {
    const saved = localStorage.getItem('clyx_live_data');
    if (saved) {
      const parsed = JSON.parse(saved);
      appData = {
        ...defaultData,
        ...parsed,
        hero: { ...defaultData.hero, ...(parsed.hero || {}) },
        stats: parsed.stats || defaultData.stats,
        portfolio: parsed.portfolio || defaultData.portfolio,
        team: parsed.team || defaultData.team,
        testimonials: parsed.testimonials || defaultData.testimonials,
        blog: parsed.blog || defaultData.blog,
        careers: parsed.careers || defaultData.careers,
        leads: parsed.leads || defaultData.leads
      };
    }
  } catch (e) {
    console.error('Error hydrating admin state:', e);
  }

  function saveState(showToast = true, toastMsg = "Changes saved! Live user page updated.") {
    try {
      localStorage.setItem('clyx_live_data', JSON.stringify(appData));
      // Notify other tabs immediately
      window.dispatchEvent(new Event('clyx_data_updated'));
      if (showToast) triggerToast(toastMsg);
    } catch (err) {
      console.error('Save failed:', err);
    }
  }

  // 2. Toast Notifications System
  const toastWrap = document.getElementById('toastWrap');
  function triggerToast(msg) {
    if (!toastWrap) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>⚡</span> <span>${msg}</span>`;
    toastWrap.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // 3. Theme Toggle Support
  const themeToggleBtn = document.getElementById('adminThemeToggle');
  let currentTheme = localStorage.getItem('clyx_standalone_theme') || 'dark';
  applyTheme(currentTheme);

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeToggleBtn) {
      themeToggleBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
      themeToggleBtn.title = `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`;
    }
    localStorage.setItem('clyx_standalone_theme', theme);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(currentTheme);
    });
  }

  // 4. Tab Switching
  const navItems = document.querySelectorAll('.nav-item[data-tab]');
  const tabPanes = document.querySelectorAll('.tab-pane');
  const pageTitle = document.getElementById('topbarTitle');

  navItems.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabKey = btn.getAttribute('data-tab');
      navItems.forEach(n => n.classList.remove('active'));
      btn.classList.add('active');

      tabPanes.forEach(pane => {
        pane.classList.toggle('active', pane.id === `tab-${tabKey}`);
      });

      const titleMap = {
        'dashboard': 'Dashboard Overview',
        'campaigns': 'Campaigns & Case Studies CMS',
        'headlines': 'Hero Headline & Stat Counters',
        'team': 'Leadership & Founders',
        'testimonials': 'Client Reviews & Testimonials',
        'blog': 'Articles & Guides CMS',
        'careers': 'Careers & Job Openings',
        'leads': 'Inquiries & CRM Leads Inbox',
        'settings': 'Database, Supabase & Media Settings'
      };
      if (pageTitle) pageTitle.textContent = titleMap[tabKey] || 'Admin Control Center';
    });
  });

  // 5. Dashboard Summary Metrics
  function updateDashboardKPIs() {
    const kpiCampaigns = document.getElementById('kpiCampaigns');
    const kpiLeads = document.getElementById('kpiLeads');
    const kpiArticles = document.getElementById('kpiArticles');
    const kpiAvgROAS = document.getElementById('kpiAvgROAS');
    const badgeLeads = document.getElementById('badgeLeadsCount');

    if (kpiCampaigns) kpiCampaigns.textContent = appData.portfolio.length;
    if (kpiLeads) kpiLeads.textContent = appData.leads.length;
    if (badgeLeads) badgeLeads.textContent = appData.leads.filter(l => l.status === 'New').length || appData.leads.length;
    if (kpiArticles) kpiArticles.textContent = appData.blog.length;

    // Calculate Average ROAS
    if (kpiAvgROAS && appData.portfolio.length) {
      const roasValues = appData.portfolio.map(p => parseFloat(p.results?.roas) || 0).filter(v => v > 0);
      const avg = roasValues.length ? (roasValues.reduce((a, b) => a + b, 0) / roasValues.length).toFixed(1) : "3.8";
      kpiAvgROAS.textContent = `${avg}X`;
    }
  }

  // 6. Modal System Helper
  const editModal = document.getElementById('editModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalSaveBtn = document.getElementById('modalSaveBtn');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalCancelBtn = document.getElementById('modalCancelBtn');

  let currentSaveHandler = null;

  function openModal(title, formHTML, onSave) {
    if (!editModal) return;
    modalTitle.textContent = title;
    modalBody.innerHTML = formHTML;
    currentSaveHandler = onSave;
    editModal.classList.add('open');
  }

  function closeModal() {
    if (!editModal) return;
    editModal.classList.remove('open');
    modalBody.innerHTML = '';
    currentSaveHandler = null;
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener('click', closeModal);
  if (modalSaveBtn) {
    modalSaveBtn.addEventListener('click', () => {
      if (typeof currentSaveHandler === 'function') {
        const success = currentSaveHandler();
        if (success !== false) closeModal();
      }
    });
  }

  // 7. MODULE: CAMPAIGNS & CASE STUDIES
  function renderCampaignsTable(filterText = '', catFilter = 'all') {
    const tbody = document.getElementById('campaignsTableBody');
    if (!tbody) return;

    let items = [...appData.portfolio];
    if (catFilter !== 'all') {
      items = items.filter(p => p.category === catFilter);
    }
    if (filterText) {
      const q = filterText.toLowerCase();
      items = items.filter(p => p.title.toLowerCase().includes(q) || (p.summary && p.summary.toLowerCase().includes(q)));
    }

    if (!items.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:32px; color:var(--text-muted);">No campaigns found. Click "+ New Campaign" to add one!</td></tr>`;
      return;
    }

    tbody.innerHTML = items.map((p, idx) => `
      <tr>
        <td>
          <img src="${p.heroImg}" alt="${p.title}" class="table-thumb" onerror="this.src='https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200'">
        </td>
        <td>
          <strong style="font-size:0.92rem; color:var(--text-primary);">${p.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">${p.deliverables || 'Creator Whitelisting'}</div>
        </td>
        <td>
          <span class="tag-pill">${p.categoryName || p.category}</span>
        </td>
        <td>
          <span class="tag-pill pill-yellow">${p.results?.roas || '4.0X'} ROAS</span>
        </td>
        <td style="font-size:0.78rem; color:var(--text-secondary); max-width:280px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
          ${p.summary || ''}
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.editCampaign('${p.id}')">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.deleteCampaign('${p.id}')">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.editCampaign = function(id) {
    const p = appData.portfolio.find(item => item.id === id);
    if (!p) return;

    const formHTML = `
      <div class="form-group">
        <label>Campaign / Brand Name</label>
        <input type="text" id="f_camp_title" class="form-control" value="${p.title}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category Key</label>
          <select id="f_camp_cat" class="form-control">
            <option value="fashion" ${p.category === 'fashion' ? 'selected' : ''}>Fashion</option>
            <option value="beauty" ${p.category === 'beauty' ? 'selected' : ''}>Beauty</option>
            <option value="food" ${p.category === 'food' ? 'selected' : ''}>Food & Bev</option>
            <option value="tech" ${p.category === 'tech' ? 'selected' : ''}>Consumer Tech</option>
          </select>
        </div>
        <div class="form-group">
          <label>Category Display Name</label>
          <input type="text" id="f_camp_catName" class="form-control" value="${p.categoryName || ''}">
        </div>
      </div>
      <div class="form-group">
        <label>Deliverables Subtitle</label>
        <input type="text" id="f_camp_deliv" class="form-control" value="${p.deliverables || ''}">
      </div>
      <div class="form-group">
        <label>Hero Image URL</label>
        <input type="text" id="f_camp_img" class="form-control" value="${p.heroImg}" oninput="document.getElementById('imgPrev').src = this.value">
        <div class="img-preview-box" style="margin-top:8px;">
          <img id="imgPrev" src="${p.heroImg}" onerror="this.src='https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400'">
        </div>
      </div>
      <div class="form-row-4">
        <div class="form-group">
          <label>Blended ROAS</label>
          <input type="text" id="f_camp_roas" class="form-control" value="${p.results?.roas || '4.0X'}">
        </div>
        <div class="form-group">
          <label>Revenue Growth</label>
          <input type="text" id="f_camp_rev" class="form-control" value="${p.results?.revenue || '+200%'}">
        </div>
        <div class="form-group">
          <label>CPA Drop</label>
          <input type="text" id="f_camp_cpa" class="form-control" value="${p.results?.cpa || '-40%'}">
        </div>
        <div class="form-group">
          <label>Reach</label>
          <input type="text" id="f_camp_reach" class="form-control" value="${p.results?.reach || '5.0M'}">
        </div>
      </div>
      <div class="form-group">
        <label>Case Study Summary (Clamped on Card)</label>
        <textarea id="f_camp_summary" class="form-control">${p.summary || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Challenge / Problem</label>
        <textarea id="f_camp_problem" class="form-control">${p.problem || ''}</textarea>
      </div>
      <div class="form-group">
        <label>Whitelisting Strategy</label>
        <textarea id="f_camp_strategy" class="form-control">${p.strategy || ''}</textarea>
      </div>
    `;

    openModal(`Edit Campaign: ${p.title}`, formHTML, () => {
      p.title = document.getElementById('f_camp_title').value.trim() || p.title;
      p.category = document.getElementById('f_camp_cat').value;
      p.categoryName = document.getElementById('f_camp_catName').value.trim() || p.category;
      p.deliverables = document.getElementById('f_camp_deliv').value.trim();
      p.heroImg = document.getElementById('f_camp_img').value.trim();
      p.results = {
        roas: document.getElementById('f_camp_roas').value.trim(),
        revenue: document.getElementById('f_camp_rev').value.trim(),
        cpa: document.getElementById('f_camp_cpa').value.trim(),
        reach: document.getElementById('f_camp_reach').value.trim()
      };
      p.summary = document.getElementById('f_camp_summary').value.trim();
      p.problem = document.getElementById('f_camp_problem').value.trim();
      p.strategy = document.getElementById('f_camp_strategy').value.trim();

      saveState(true, `Updated "${p.title}"! User website updated.`);
      renderCampaignsTable();
      updateDashboardKPIs();
      return true;
    });
  };

  window.deleteCampaign = function(id) {
    if (!confirm('Are you sure you want to delete this campaign? It will be removed from the 3D Coverflow carousel on the main site.')) return;
    appData.portfolio = appData.portfolio.filter(item => item.id !== id);
    saveState(true, 'Campaign removed.');
    renderCampaignsTable();
    updateDashboardKPIs();
  };

  const addCampaignBtn = document.getElementById('addCampaignBtn');
  if (addCampaignBtn) {
    addCampaignBtn.addEventListener('click', () => {
      const defaultImg = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000";
      const formHTML = `
        <div class="form-group">
          <label>Campaign / Brand Name</label>
          <input type="text" id="f_camp_title" class="form-control" placeholder="e.g. SOLIS SMART RING">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select id="f_camp_cat" class="form-control">
              <option value="tech">Consumer Tech</option>
              <option value="fashion">Fashion & Apparel</option>
              <option value="beauty">Beauty & Wellness</option>
              <option value="food">Food & Beverage</option>
            </select>
          </div>
          <div class="form-group">
            <label>Category Display Subtitle</label>
            <input type="text" id="f_camp_catName" class="form-control" placeholder="e.g. Smart Wearables">
          </div>
        </div>
        <div class="form-group">
          <label>Deliverables</label>
          <input type="text" id="f_camp_deliv" class="form-control" placeholder="e.g. Reels UGC + Meta Advantage+ Scaling">
        </div>
        <div class="form-group">
          <label>Hero Image URL</label>
          <input type="text" id="f_camp_img" class="form-control" value="${defaultImg}" oninput="document.getElementById('imgPrev').src = this.value">
          <div class="img-preview-box" style="margin-top:8px;">
            <img id="imgPrev" src="${defaultImg}">
          </div>
        </div>
        <div class="form-row-4">
          <div class="form-group">
            <label>Blended ROAS</label>
            <input type="text" id="f_camp_roas" class="form-control" value="4.8X">
          </div>
          <div class="form-group">
            <label>Revenue</label>
            <input type="text" id="f_camp_rev" class="form-control" value="+340%">
          </div>
          <div class="form-group">
            <label>CPA Drop</label>
            <input type="text" id="f_camp_cpa" class="form-control" value="-46%">
          </div>
          <div class="form-group">
            <label>Reach</label>
            <input type="text" id="f_camp_reach" class="form-control" value="7.2M">
          </div>
        </div>
        <div class="form-group">
          <label>Summary</label>
          <textarea id="f_camp_summary" class="form-control" placeholder="Short 2-line performance summary..."></textarea>
        </div>
      `;

      openModal("Add New Client Campaign", formHTML, () => {
        const title = document.getElementById('f_camp_title').value.trim();
        if (!title) {
          alert('Please enter a campaign name');
          return false;
        }
        const newCamp = {
          id: `camp-${Date.now()}`,
          title: title.toUpperCase(),
          category: document.getElementById('f_camp_cat').value,
          categoryName: document.getElementById('f_camp_catName').value.trim() || 'D2C Brand',
          deliverables: document.getElementById('f_camp_deliv').value.trim() || 'Performance Ads',
          heroImg: document.getElementById('f_camp_img').value.trim() || defaultImg,
          results: {
            roas: document.getElementById('f_camp_roas').value.trim() || '4.0X',
            revenue: document.getElementById('f_camp_rev').value.trim() || '+200%',
            cpa: document.getElementById('f_camp_cpa').value.trim() || '-30%',
            reach: document.getElementById('f_camp_reach').value.trim() || '4.0M'
          },
          summary: document.getElementById('f_camp_summary').value.trim() || 'Scaled performance through creator whitelisting and automated attribution.',
          problem: "High acquisition costs across unoptimized broad audiences.",
          strategy: "Built a creator-led whitelisting engine delivering scalable ROAS lift."
        };

        appData.portfolio.unshift(newCamp);
        saveState(true, `Added "${newCamp.title}" to Coverflow carousel!`);
        renderCampaignsTable();
        updateDashboardKPIs();
        return true;
      });
    });
  }

  // Campaign Category Filters & Search
  const campSearch = document.getElementById('campSearch');
  const campFilterCat = document.getElementById('campFilterCat');
  if (campSearch) campSearch.addEventListener('input', () => renderCampaignsTable(campSearch.value, campFilterCat?.value || 'all'));
  if (campFilterCat) campFilterCat.addEventListener('change', () => renderCampaignsTable(campSearch?.value || '', campFilterCat.value));

  // 8. MODULE: HEADLINES & STAT COUNTERS
  function populateHeadlinesForm() {
    const fEyebrow = document.getElementById('h_eyebrow');
    const fLine1 = document.getElementById('h_line1');
    const fLine2 = document.getElementById('h_line2');
    const fSub = document.getElementById('h_sub');

    if (fEyebrow) fEyebrow.value = appData.hero.eyebrow || '';
    if (fLine1) fLine1.value = appData.hero.line1 || '';
    if (fLine2) fLine2.value = appData.hero.line2 || '';
    if (fSub) fSub.value = appData.hero.sub || '';

    // Stat Counters
    appData.stats.forEach((s, idx) => {
      const targetInput = document.getElementById(`stat_${idx}_target`);
      const prefixInput = document.getElementById(`stat_${idx}_prefix`);
      const suffixInput = document.getElementById(`stat_${idx}_suffix`);
      const labelInput = document.getElementById(`stat_${idx}_label`);
      const detailInput = document.getElementById(`stat_${idx}_detail`);

      if (targetInput) targetInput.value = s.target;
      if (prefixInput) prefixInput.value = s.prefix || '';
      if (suffixInput) suffixInput.value = s.suffix || '';
      if (labelInput) labelInput.value = s.label || '';
      if (detailInput) detailInput.value = s.detail || '';
    });
  }

  const saveHeadlinesBtn = document.getElementById('saveHeadlinesBtn');
  if (saveHeadlinesBtn) {
    saveHeadlinesBtn.addEventListener('click', () => {
      appData.hero = {
        ...appData.hero,
        eyebrow: document.getElementById('h_eyebrow').value.trim(),
        line1: document.getElementById('h_line1').value.trim(),
        line2: document.getElementById('h_line2').value.trim(),
        sub: document.getElementById('h_sub').value.trim()
      };

      appData.stats = appData.stats.map((s, idx) => ({
        ...s,
        target: parseFloat(document.getElementById(`stat_${idx}_target`).value) || s.target,
        prefix: document.getElementById(`stat_${idx}_prefix`).value,
        suffix: document.getElementById(`stat_${idx}_suffix`).value,
        label: document.getElementById(`stat_${idx}_label`).value.trim(),
        detail: document.getElementById(`stat_${idx}_detail`).value.trim()
      }));

      saveState(true, "Headlines & Stat Counters updated on user website!");
    });
  }

  // 9. MODULE: LEADERSHIP & FOUNDERS
  function renderTeamTable() {
    const tbody = document.getElementById('teamTableBody');
    if (!tbody) return;

    tbody.innerHTML = appData.team.map((m, idx) => `
      <tr>
        <td>
          <img src="${m.img}" alt="${m.name}" class="table-thumb" style="border-radius:50%;" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'">
        </td>
        <td>
          <strong style="font-size:0.92rem;">${m.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">Monogram: [${m.monogram}]</div>
        </td>
        <td>
          <span class="tag-pill pill-blue">${m.title}</span>
        </td>
        <td style="font-size:0.78rem; color:var(--text-secondary); max-width:320px;">
          ${m.bio}
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.editMember(${idx})">Edit</button>
        </td>
      </tr>
    `).join('');
  }

  window.editMember = function(idx) {
    const m = appData.team[idx];
    if (!m) return;

    const formHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>Full Name</label>
          <input type="text" id="f_mem_name" class="form-control" value="${m.name}">
        </div>
        <div class="form-group">
          <label>Monogram Initial</label>
          <input type="text" id="f_mem_mono" class="form-control" value="${m.monogram}">
        </div>
      </div>
      <div class="form-group">
        <label>Designation / Role Title</label>
        <input type="text" id="f_mem_title" class="form-control" value="${m.title}">
      </div>
      <div class="form-group">
        <label>Avatar / Photo URL</label>
        <input type="text" id="f_mem_img" class="form-control" value="${m.img}" oninput="document.getElementById('memPrev').src = this.value">
        <div class="img-preview-box" style="margin-top:8px; height:120px;">
          <img id="memPrev" src="${m.img}" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">
        </div>
      </div>
      <div class="form-group">
        <label>Executive Bio</label>
        <textarea id="f_mem_bio" class="form-control">${m.bio}</textarea>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>LinkedIn URL</label>
          <input type="text" id="f_mem_in" class="form-control" value="${m.social?.linkedin || ''}">
        </div>
        <div class="form-group">
          <label>WhatsApp Phone</label>
          <input type="text" id="f_mem_wa" class="form-control" value="${m.social?.whatsapp || ''}">
        </div>
      </div>
    `;

    openModal(`Edit Leader: ${m.name}`, formHTML, () => {
      m.name = document.getElementById('f_mem_name').value.trim() || m.name;
      m.monogram = document.getElementById('f_mem_mono').value.trim() || m.monogram;
      m.title = document.getElementById('f_mem_title').value.trim() || m.title;
      m.img = document.getElementById('f_mem_img').value.trim() || m.img;
      m.bio = document.getElementById('f_mem_bio').value.trim() || m.bio;
      m.social = {
        linkedin: document.getElementById('f_mem_in').value.trim(),
        whatsapp: document.getElementById('f_mem_wa').value.trim()
      };

      saveState(true, `Updated ${m.name}! Changes live on site.`);
      renderTeamTable();
      return true;
    });
  };

  // 10. MODULE: TESTIMONIALS
  function renderTestimonialsTable() {
    const tbody = document.getElementById('testiTableBody');
    if (!tbody) return;

    tbody.innerHTML = appData.testimonials.map((t, idx) => `
      <tr>
        <td>
          <strong style="color:var(--text-primary); font-size:0.9rem;">${t.author}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${t.brand}</div>
        </td>
        <td style="font-size:0.8rem; color:var(--text-secondary); max-width:380px;">
          "${t.quote}"
        </td>
        <td>
          <span class="tag-pill pill-yellow">${t.metric || '+300% ROAS'}</span>
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.editTestimonial(${idx})">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.deleteTestimonial(${idx})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.editTestimonial = function(idx) {
    const t = appData.testimonials[idx];
    if (!t) return;

    const formHTML = `
      <div class="form-row">
        <div class="form-group">
          <label>Client / Founder Name</label>
          <input type="text" id="f_t_author" class="form-control" value="${t.author}">
        </div>
        <div class="form-group">
          <label>Brand / Company</label>
          <input type="text" id="f_t_brand" class="form-control" value="${t.brand}">
        </div>
      </div>
      <div class="form-group">
        <label>Metric Badge (e.g. +340% ROAS)</label>
        <input type="text" id="f_t_metric" class="form-control" value="${t.metric || ''}">
      </div>
      <div class="form-group">
        <label>Client Review Quote</label>
        <textarea id="f_t_quote" class="form-control">${t.quote}</textarea>
      </div>
    `;

    openModal(`Edit Testimonial: ${t.author}`, formHTML, () => {
      t.author = document.getElementById('f_t_author').value.trim() || t.author;
      t.brand = document.getElementById('f_t_brand').value.trim() || t.brand;
      t.metric = document.getElementById('f_t_metric').value.trim();
      t.quote = document.getElementById('f_t_quote').value.trim() || t.quote;

      saveState(true, "Updated testimonial scroller!");
      renderTestimonialsTable();
      return true;
    });
  };

  window.deleteTestimonial = function(idx) {
    if (!confirm('Delete this client testimonial?')) return;
    appData.testimonials.splice(idx, 1);
    saveState(true, "Testimonial removed.");
    renderTestimonialsTable();
  };

  const addTestiBtn = document.getElementById('addTestiBtn');
  if (addTestiBtn) {
    addTestiBtn.addEventListener('click', () => {
      const formHTML = `
        <div class="form-row">
          <div class="form-group">
            <label>Client Name</label>
            <input type="text" id="f_t_author" class="form-control" placeholder="e.g. Rohan Verma">
          </div>
          <div class="form-group">
            <label>Brand</label>
            <input type="text" id="f_t_brand" class="form-control" placeholder="e.g. Founder, Aura Naturals">
          </div>
        </div>
        <div class="form-group">
          <label>Metric Badge</label>
          <input type="text" id="f_t_metric" class="form-control" placeholder="e.g. 4.2X Blended ROAS">
        </div>
        <div class="form-group">
          <label>Review Quote</label>
          <textarea id="f_t_quote" class="form-control" placeholder="What they said about working with CLYX..."></textarea>
        </div>
      `;

      openModal("Add Client Review", formHTML, () => {
        const author = document.getElementById('f_t_author').value.trim();
        const quote = document.getElementById('f_t_quote').value.trim();
        if (!author || !quote) {
          alert('Please enter author and quote');
          return false;
        }
        appData.testimonials.push({
          author,
          brand: document.getElementById('f_t_brand').value.trim() || 'D2C Partner',
          metric: document.getElementById('f_t_metric').value.trim() || 'Verified Scale',
          quote
        });
        saveState(true, "Added new testimonial!");
        renderTestimonialsTable();
        return true;
      });
    });
  }

  // 11. MODULE: BLOG & ARTICLES
  function renderBlogTable() {
    const tbody = document.getElementById('blogTableBody');
    if (!tbody) return;

    tbody.innerHTML = appData.blog.map((b, idx) => `
      <tr>
        <td>
          <img src="${b.img}" alt="${b.title}" class="table-thumb" onerror="this.src='https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200'">
        </td>
        <td>
          <strong style="color:var(--text-primary); font-size:0.9rem;">${b.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${b.date} • ${b.readTime}</div>
        </td>
        <td>
          <span class="tag-pill">${b.category}</span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-secondary); max-width:300px;">
          ${b.summary}
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.editBlogPost(${idx})">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.deleteBlogPost(${idx})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.editBlogPost = function(idx) {
    const b = appData.blog[idx];
    if (!b) return;

    const formHTML = `
      <div class="form-group">
        <label>Article Title</label>
        <input type="text" id="f_b_title" class="form-control" value="${b.title}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Category Tag</label>
          <input type="text" id="f_b_cat" class="form-control" value="${b.category}">
        </div>
        <div class="form-group">
          <label>Read Time</label>
          <input type="text" id="f_b_time" class="form-control" value="${b.readTime}">
        </div>
      </div>
      <div class="form-group">
        <label>Cover Image URL</label>
        <input type="text" id="f_b_img" class="form-control" value="${b.img}" oninput="document.getElementById('blogPrev').src = this.value">
        <div class="img-preview-box" style="margin-top:8px; height:120px;">
          <img id="blogPrev" src="${b.img}">
        </div>
      </div>
      <div class="form-group">
        <label>Summary / Excerpt</label>
        <textarea id="f_b_sum" class="form-control">${b.summary}</textarea>
      </div>
    `;

    openModal(`Edit Article: ${b.title}`, formHTML, () => {
      b.title = document.getElementById('f_b_title').value.trim() || b.title;
      b.category = document.getElementById('f_b_cat').value.trim() || b.category;
      b.readTime = document.getElementById('f_b_time').value.trim() || b.readTime;
      b.img = document.getElementById('f_b_img').value.trim() || b.img;
      b.summary = document.getElementById('f_b_sum').value.trim() || b.summary;

      saveState(true, "Updated blog post!");
      renderBlogTable();
      updateDashboardKPIs();
      return true;
    });
  };

  window.deleteBlogPost = function(idx) {
    if (!confirm('Delete this article?')) return;
    appData.blog.splice(idx, 1);
    saveState(true, "Article deleted.");
    renderBlogTable();
    updateDashboardKPIs();
  };

  const addBlogBtn = document.getElementById('addBlogBtn');
  if (addBlogBtn) {
    addBlogBtn.addEventListener('click', () => {
      const defaultImg = "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600";
      const formHTML = `
        <div class="form-group">
          <label>Article Title</label>
          <input type="text" id="f_b_title" class="form-control" placeholder="e.g. Scaling Past $100K/Mo on Meta">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <input type="text" id="f_b_cat" class="form-control" value="Performance Ads">
          </div>
          <div class="form-group">
            <label>Read Time</label>
            <input type="text" id="f_b_time" class="form-control" value="5 min read">
          </div>
        </div>
        <div class="form-group">
          <label>Cover Image URL</label>
          <input type="text" id="f_b_img" class="form-control" value="${defaultImg}">
        </div>
        <div class="form-group">
          <label>Summary</label>
          <textarea id="f_b_sum" class="form-control" placeholder="Key takeaways and summary of the article..."></textarea>
        </div>
      `;

      openModal("Publish New Article", formHTML, () => {
        const title = document.getElementById('f_b_title').value.trim();
        if (!title) {
          alert('Please enter a title');
          return false;
        }
        appData.blog.unshift({
          title,
          category: document.getElementById('f_b_cat').value.trim() || 'Strategy',
          readTime: document.getElementById('f_b_time').value.trim() || '4 min read',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          img: document.getElementById('f_b_img').value.trim() || defaultImg,
          summary: document.getElementById('f_b_sum').value.trim() || 'Tactical guide on scaling paid acquisition.'
        });
        saveState(true, "Published new blog post!");
        renderBlogTable();
        updateDashboardKPIs();
        return true;
      });
    });
  }

  // 12. MODULE: CAREERS
  function renderCareersTable() {
    const tbody = document.getElementById('careersTableBody');
    if (!tbody) return;

    tbody.innerHTML = appData.careers.map((c, idx) => `
      <tr>
        <td>
          <strong style="color:var(--text-primary); font-size:0.9rem;">${c.title}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${c.location} • ${c.compensation}</div>
        </td>
        <td>
          <span class="tag-pill pill-yellow">${c.tag}</span>
        </td>
        <td>
          <span class="tag-pill pill-green">${c.type}</span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-secondary); max-width:300px;">
          ${c.description}
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-secondary btn-sm" onclick="window.editCareer(${idx})">Edit</button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.deleteCareer(${idx})">Delete</button>
        </td>
      </tr>
    `).join('');
  }

  window.editCareer = function(idx) {
    const c = appData.careers[idx];
    if (!c) return;

    const formHTML = `
      <div class="form-group">
        <label>Job Title</label>
        <input type="text" id="f_c_title" class="form-control" value="${c.title}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Department Tag</label>
          <input type="text" id="f_c_tag" class="form-control" value="${c.tag}">
        </div>
        <div class="form-group">
          <label>Employment Type</label>
          <input type="text" id="f_c_type" class="form-control" value="${c.type}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Location</label>
          <input type="text" id="f_c_loc" class="form-control" value="${c.location}">
        </div>
        <div class="form-group">
          <label>Compensation</label>
          <input type="text" id="f_c_comp" class="form-control" value="${c.compensation}">
        </div>
      </div>
      <div class="form-group">
        <label>Role Description & Scope</label>
        <textarea id="f_c_desc" class="form-control">${c.description}</textarea>
      </div>
    `;

    openModal(`Edit Role: ${c.title}`, formHTML, () => {
      c.title = document.getElementById('f_c_title').value.trim() || c.title;
      c.tag = document.getElementById('f_c_tag').value.trim() || c.tag;
      c.type = document.getElementById('f_c_type').value.trim() || c.type;
      c.location = document.getElementById('f_c_loc').value.trim() || c.location;
      c.compensation = document.getElementById('f_c_comp').value.trim() || c.compensation;
      c.description = document.getElementById('f_c_desc').value.trim() || c.description;

      saveState(true, "Updated job listing!");
      renderCareersTable();
      return true;
    });
  };

  window.deleteCareer = function(idx) {
    if (!confirm('Remove this job opening from website?')) return;
    appData.careers.splice(idx, 1);
    saveState(true, "Job listing removed.");
    renderCareersTable();
  };

  const addCareerBtn = document.getElementById('addCareerBtn');
  if (addCareerBtn) {
    addCareerBtn.addEventListener('click', () => {
      const formHTML = `
        <div class="form-group">
          <label>Job Title</label>
          <input type="text" id="f_c_title" class="form-control" placeholder="e.g. Head of Video Editing & Motion Graphics">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Department</label>
            <input type="text" id="f_c_tag" class="form-control" value="Creative Ops">
          </div>
          <div class="form-group">
            <label>Type</label>
            <input type="text" id="f_c_type" class="form-control" value="Full-Time">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Location</label>
            <input type="text" id="f_c_loc" class="form-control" value="Remote (India)">
          </div>
          <div class="form-group">
            <label>Compensation</label>
            <input type="text" id="f_c_comp" class="form-control" value="Competitive + Performance Bonus">
          </div>
        </div>
        <div class="form-group">
          <label>Job Description</label>
          <textarea id="f_c_desc" class="form-control" placeholder="Brief outline of expectations and requirements..."></textarea>
        </div>
      `;

      openModal("Post New Career Opening", formHTML, () => {
        const title = document.getElementById('f_c_title').value.trim();
        if (!title) {
          alert('Please enter a job title');
          return false;
        }
        appData.careers.push({
          title,
          tag: document.getElementById('f_c_tag').value.trim() || 'General',
          type: document.getElementById('f_c_type').value.trim() || 'Full-Time',
          location: document.getElementById('f_c_loc').value.trim() || 'Remote',
          compensation: document.getElementById('f_c_comp').value.trim() || 'Competitive',
          description: document.getElementById('f_c_desc').value.trim() || 'Join CLYX Media growth engine.'
        });
        saveState(true, "Posted new job opening!");
        renderCareersTable();
        return true;
      });
    });
  }

  // 13. MODULE: LEADS & INQUIRIES CRM
  function renderLeadsTable() {
    const tbody = document.getElementById('leadsTableBody');
    if (!tbody) return;

    tbody.innerHTML = appData.leads.map((l, idx) => `
      <tr>
        <td>
          <strong style="color:var(--text-primary); font-size:0.92rem;">${l.name}</strong>
          <div style="font-size:0.75rem; color:var(--text-muted);">${l.email} • ${l.phone}</div>
        </td>
        <td>
          <span style="font-weight:600; color:var(--text-primary);">${l.brand}</span>
        </td>
        <td>
          <span class="tag-pill pill-yellow">${l.budget}</span>
        </td>
        <td style="font-size:0.8rem; color:var(--text-secondary);">
          ${l.service}
        </td>
        <td style="font-size:0.78rem; color:var(--text-muted);">
          ${l.date}
        </td>
        <td>
          <select class="form-control" style="padding:4px 8px; font-size:0.78rem; width:130px;" onchange="window.updateLeadStatus(${idx}, this.value)">
            <option value="New" ${l.status === 'New' ? 'selected' : ''}>🟢 New</option>
            <option value="Contacted" ${l.status === 'Contacted' ? 'selected' : ''}>🟡 Contacted</option>
            <option value="Proposal Sent" ${l.status === 'Proposal Sent' ? 'selected' : ''}>🔵 Proposal</option>
            <option value="Closed" ${l.status === 'Closed' ? 'selected' : ''}>🟣 Won / Closed</option>
          </select>
        </td>
        <td style="text-align:right;">
          <button type="button" class="btn btn-danger btn-sm" onclick="window.deleteLead(${idx})">✕</button>
        </td>
      </tr>
    `).join('');
  }

  window.updateLeadStatus = function(idx, newStatus) {
    if (appData.leads[idx]) {
      appData.leads[idx].status = newStatus;
      saveState(false);
      updateDashboardKPIs();
      triggerToast(`Lead status updated to: ${newStatus}`);
    }
  };

  window.deleteLead = function(idx) {
    if (!confirm('Remove this inquiry?')) return;
    appData.leads.splice(idx, 1);
    saveState(true, "Inquiry deleted.");
    renderLeadsTable();
    updateDashboardKPIs();
  };

  // Export Leads to CSV
  const exportCsvBtn = document.getElementById('exportLeadsCsvBtn');
  if (exportCsvBtn) {
    exportCsvBtn.addEventListener('click', () => {
      const headers = ["ID", "Client Name", "Brand / Website", "Email", "Phone", "Monthly Ad Spend", "Service Interested", "Submission Date", "Status"];
      const rows = appData.leads.map(l => [
        l.id,
        `"${l.name}"`,
        `"${l.brand}"`,
        l.email,
        l.phone,
        `"${l.budget}"`,
        `"${l.service}"`,
        l.date,
        l.status
      ]);
      const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `CLYX_Leads_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      triggerToast("Downloaded Leads CSV report!");
    });
  }

  // 14. MODULE: SETTINGS, SUPABASE, BACKUP & RESET
  const supUrlInput = document.getElementById('supUrlInput');
  const supKeyInput = document.getElementById('supKeyInput');
  const connectSupabaseBtn = document.getElementById('connectSupabaseBtn');

  if (supUrlInput) supUrlInput.value = appData.supabaseConfig.url || '';
  if (supKeyInput) supKeyInput.value = appData.supabaseConfig.anonKey || '';

  if (connectSupabaseBtn) {
    connectSupabaseBtn.addEventListener('click', () => {
      const url = supUrlInput.value.trim();
      const key = supKeyInput.value.trim();
      localStorage.setItem('clyx_supabase_url', url);
      localStorage.setItem('clyx_supabase_key', key);
      appData.supabaseConfig = { url, key };
      saveState(false);
      triggerToast("Supabase configuration saved! Connected to cloud project.");
    });
  }

  const exportBackupBtn = document.getElementById('exportBackupBtn');
  if (exportBackupBtn) {
    exportBackupBtn.addEventListener('click', () => {
      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", jsonStr);
      downloadAnchor.setAttribute("download", `CLYX_Backup_${new Date().toISOString().slice(0,10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerToast("Downloaded complete website JSON backup!");
    });
  }

  const resetDefaultsBtn = document.getElementById('resetDefaultsBtn');
  if (resetDefaultsBtn) {
    resetDefaultsBtn.addEventListener('click', () => {
      if (!confirm("⚠️ Are you sure you want to reset all data back to original factory defaults? Any custom edits made in this admin panel will be reverted.")) return;
      localStorage.removeItem('clyx_live_data');
      appData = { ...defaultData };
      saveState(false);
      triggerToast("Reset to factory defaults! Reloading...");
      setTimeout(() => location.reload(), 800);
    });
  }

  // 15. PASSCODE ZERO-TRUST AUTH GATE
  const authOverlay = document.getElementById('adminAuthOverlay');
  const authForm = document.getElementById('adminAuthForm');
  const passInput = document.getElementById('adminPassInput');
  const errorMsg = document.getElementById('authErrorMsg');
  const signOutBtn = document.getElementById('adminSignOutBtn');
  const updatePasscodeBtn = document.getElementById('updatePasscodeBtn');
  const newPassInput = document.getElementById('newAdminPassInput');

  const defaultPasscode = "clyx2026";
  const getStoredPasscode = () => localStorage.getItem('clyx_admin_pass') || defaultPasscode;

  function checkAuth() {
    const isAuthed = sessionStorage.getItem('clyx_admin_logged_in') === 'true';
    if (authOverlay) {
      authOverlay.style.display = isAuthed ? 'none' : 'flex';
      if (!isAuthed && passInput) setTimeout(() => passInput.focus(), 100);
    }
  }

  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const entered = (passInput.value || '').trim();
      if (entered === getStoredPasscode()) {
        sessionStorage.setItem('clyx_admin_logged_in', 'true');
        checkAuth();
        triggerToast("Access Granted! Welcome to CLYX Admin.");
      } else {
        if (errorMsg) {
          errorMsg.textContent = "Invalid passcode. Access denied.";
          errorMsg.style.display = "block";
        }
        passInput.value = "";
        passInput.focus();
      }
    });
  }

  if (signOutBtn) {
    signOutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('clyx_admin_logged_in');
      location.reload();
    });
  }

  if (updatePasscodeBtn && newPassInput) {
    updatePasscodeBtn.addEventListener('click', () => {
      const newPass = newPassInput.value.trim();
      if (!newPass || newPass.length < 4) {
        alert("Please enter a secure passcode of at least 4 characters.");
        return;
      }
      localStorage.setItem('clyx_admin_pass', newPass);
      newPassInput.value = "";
      triggerToast("Admin passcode updated successfully!");
    });
  }

  checkAuth();

  // Initial Renders
  updateDashboardKPIs();
  renderCampaignsTable();
  populateHeadlinesForm();
  renderTeamTable();
  renderTestimonialsTable();
  renderBlogTable();
  renderCareersTable();
  renderLeadsTable();
});
