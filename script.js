/* ── VYOM script.js ── */
(function () {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     THEME  (persisted via localStorage)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('vyom_theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);

  function setTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem('vyom_theme', t);
    document.querySelectorAll('.theme-opt').forEach(b => {
      b.classList.toggle('active', b.dataset.theme === t);
    });
  }
  document.querySelectorAll('.theme-opt').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === savedTheme);
    btn.addEventListener('click', () => setTheme(btn.dataset.theme));
  });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     DEV MODE SPLASH
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const devSplash   = document.getElementById('devSplash');
  const devEnterBtn = document.getElementById('devEnterBtn');
  if (devSplash && devEnterBtn) {
    if (sessionStorage.getItem('vyom_entered')) {
      devSplash.classList.add('hidden');
      setTimeout(() => devSplash.remove(), 500);
    }
    devEnterBtn.addEventListener('click', () => {
      sessionStorage.setItem('vyom_entered', '1');
      devSplash.classList.add('hidden');
      setTimeout(() => devSplash.remove(), 500);
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     HAMBURGER (mobile)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const hamburger    = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', e => {
      e.stopPropagation();
      const open = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', !open);
      hamburger.classList.toggle('open', !open);
    });
    document.addEventListener('click', e => {
      if (!mobileDrawer.contains(e.target) && e.target !== hamburger) {
        mobileDrawer.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     3-DOT MENU
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const threeDotBtn = document.getElementById('threeDotBtn');
  const dotMenu     = document.getElementById('dotMenu');

  if (threeDotBtn && dotMenu) {
    threeDotBtn.addEventListener('click', e => {
      e.stopPropagation();
      dotMenu.classList.toggle('open');
    });
    document.addEventListener('click', e => {
      if (!dotMenu.contains(e.target) && e.target !== threeDotBtn) {
        dotMenu.classList.remove('open');
      }
    });
  }

  function closeDotMenu() { if (dotMenu) dotMenu.classList.remove('open'); }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     NEW TAB
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function openNewTab() {
    window.open('index.html', '_blank');
    closeDotMenu();
  }
  const menuNewTab    = document.getElementById('menuNewTab');
  const mobileNewTab  = document.getElementById('mobileNewTab');
  if (menuNewTab)   menuNewTab.addEventListener('click', openNewTab);
  if (mobileNewTab) mobileNewTab.addEventListener('click', e => { e.preventDefault(); openNewTab(); });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     INCOGNITO
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  let incognito = false;
  const incognitoBanner  = document.getElementById('incognitoBanner');
  const exitIncognito    = document.getElementById('exitIncognito');
  const menuIncognito    = document.getElementById('menuIncognito');
  const mobileIncognito  = document.getElementById('mobileIncognito');

  function toggleIncognito() {
    incognito = !incognito;
    if (incognitoBanner) incognitoBanner.classList.toggle('active', incognito);
    closeDotMenu();
    if (mobileDrawer) { mobileDrawer.classList.remove('open'); hamburger && hamburger.classList.remove('open'); }
  }
  if (menuIncognito)   menuIncognito.addEventListener('click', toggleIncognito);
  if (mobileIncognito) mobileIncognito.addEventListener('click', e => { e.preventDefault(); toggleIncognito(); });
  if (exitIncognito)   exitIncognito.addEventListener('click', () => { incognito = false; incognitoBanner.classList.remove('active'); });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     BOOKMARKS  (localStorage)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  function getBookmarks() {
    try { return JSON.parse(localStorage.getItem('vyom_bookmarks') || '[]'); }
    catch { return []; }
  }
  function saveBookmarks(bms) {
    localStorage.setItem('vyom_bookmarks', JSON.stringify(bms));
  }

  const bmOverlay    = document.getElementById('bmOverlay');
  const bmClose      = document.getElementById('bmClose');
  const bmList       = document.getElementById('bmList');
  const bmEmpty      = document.getElementById('bmEmpty');
  const addBmOverlay = document.getElementById('addBmOverlay');
  const addBmClose   = document.getElementById('addBmClose');
  const bmTitle      = document.getElementById('bmTitle');
  const bmUrl        = document.getElementById('bmUrl');
  const bmSave       = document.getElementById('bmSave');
  const bmStatus     = document.getElementById('bmStatus');
  const menuBookmarks   = document.getElementById('menuBookmarks');
  const menuAddBookmark = document.getElementById('menuAddBookmark');
  const mobileBookmarks = document.getElementById('mobileBookmarks');

  function renderBookmarks() {
    if (!bmList) return;
    const bms = getBookmarks();
    bmList.innerHTML = '';
    if (bms.length === 0) {
      if (bmEmpty) bmEmpty.classList.add('visible');
      return;
    }
    if (bmEmpty) bmEmpty.classList.remove('visible');
    bms.forEach((bm, i) => {
      const domain = (() => { try { return new URL(bm.url).hostname; } catch { return ''; } })();
      const faviconUrl = domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=32` : '';
      const item = document.createElement('div');
      item.className = 'bm-item';
      item.innerHTML = `
        <div class="bm-item-icon">
          ${faviconUrl ? `<img src="${faviconUrl}" alt="" onerror="this.style.display='none'"/>` : ''}
        </div>
        <div class="bm-item-info">
          <div class="bm-item-title">${escHtml(bm.title)}</div>
          <div class="bm-item-url">${escHtml(bm.url)}</div>
        </div>
        <button class="bm-item-del" data-idx="${i}" title="Remove">✕</button>
      `;
      item.addEventListener('click', e => {
        if (e.target.classList.contains('bm-item-del')) return;
        window.open(bm.url, '_blank', 'noopener,noreferrer');
      });
      item.querySelector('.bm-item-del').addEventListener('click', () => {
        const updated = getBookmarks();
        updated.splice(i, 1);
        saveBookmarks(updated);
        renderBookmarks();
      });
      bmList.appendChild(item);
    });
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function openBookmarks() {
    renderBookmarks();
    if (bmOverlay) bmOverlay.classList.add('active');
    closeDotMenu();
  }
  function openAddBookmark() {
    if (bmTitle) bmTitle.value = document.title || 'VYOM';
    if (bmUrl)   bmUrl.value   = window.location.href;
    if (bmStatus) { bmStatus.textContent = ''; bmStatus.className = 'bm-status'; }
    if (addBmOverlay) addBmOverlay.classList.add('active');
    closeDotMenu();
  }

  if (menuBookmarks)    menuBookmarks.addEventListener('click', openBookmarks);
  if (mobileBookmarks)  mobileBookmarks.addEventListener('click', e => { e.preventDefault(); openBookmarks(); });
  if (menuAddBookmark)  menuAddBookmark.addEventListener('click', openAddBookmark);
  if (bmClose)          bmClose.addEventListener('click', () => bmOverlay.classList.remove('active'));
  if (addBmClose)       addBmClose.addEventListener('click', () => addBmOverlay.classList.remove('active'));

  // Click outside closes panels
  [bmOverlay, addBmOverlay].forEach(ov => {
    if (ov) ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('active'); });
  });

  if (bmSave) {
    bmSave.addEventListener('click', () => {
      const title = bmTitle.value.trim();
      const url   = bmUrl.value.trim();
      if (!title || !url) {
        bmStatus.textContent = 'Please fill in both fields.';
        bmStatus.className = 'bm-status error'; return;
      }
      if (!url.startsWith('http')) {
        bmStatus.textContent = 'URL must start with http:// or https://';
        bmStatus.className = 'bm-status error'; return;
      }
      const bms = getBookmarks();
      bms.push({ title, url, added: Date.now() });
      saveBookmarks(bms);
      bmStatus.textContent = '✦ Bookmark saved!';
      bmStatus.className = 'bm-status success';
      setTimeout(() => { addBmOverlay.classList.remove('active'); bmStatus.textContent = ''; }, 1200);
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SEARCH
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const searchInput        = document.getElementById('searchInput');
  const searchForm         = document.getElementById('searchForm');
  const searchResultsWrap  = document.getElementById('searchResultsWrap');
  const resultsIframe      = document.getElementById('resultsIframe');
  const resultsBackBtn     = document.getElementById('resultsBackBtn');
  const resultsSearchInput = document.getElementById('resultsSearchInput');
  const resultsSearchBtn   = document.getElementById('resultsSearchBtn');

  let currentEngineUrl = 'https://www.bing.com/search?q=';
  let currentUseIframe = true;

  const placeholderMap = {
    google:'Search with Google…', bing:'Search with Bing…',
    duckduckgo:'Search privately with DuckDuckGo…', brave:'Search with Brave…',
    yahoo:'Search with Yahoo…', ecosia:'Plant trees while you search…'
  };

  if (searchInput) {
    document.querySelectorAll('.engine-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentEngineUrl = tab.dataset.url;
        currentUseIframe = tab.dataset.iframe === 'true';
        searchInput.placeholder = placeholderMap[tab.dataset.engine] || 'Where do you want to go today?';
      });
    });

    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) { shakeBox(); return; }
      doSearch(q);
    });

    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault(); searchInput.focus();
      }
    });
  }

  if (resultsSearchBtn) {
    resultsSearchBtn.addEventListener('click', () => {
      const q = resultsSearchInput.value.trim();
      if (q) doSearch(q);
    });
  }
  if (resultsSearchInput) {
    resultsSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') { const q = resultsSearchInput.value.trim(); if (q) doSearch(q); }
    });
  }
  if (resultsBackBtn) resultsBackBtn.addEventListener('click', closeResults);

  function doSearch(query) {
    const url = currentEngineUrl + encodeURIComponent(query);
    if (currentUseIframe && searchResultsWrap && resultsIframe) {
      resultsIframe.src = url;
      if (resultsSearchInput) resultsSearchInput.value = query;
      searchResultsWrap.classList.add('active');
    } else {
      window.location.href = url;
    }
  }

  function closeResults() {
    if (searchResultsWrap) searchResultsWrap.classList.remove('active');
    if (resultsIframe)     resultsIframe.src = '';
  }

  function shakeBox() {
    const b = document.querySelector('.search-box');
    if (!b) return;
    b.style.animation = 'none';
    requestAnimationFrame(() => { b.style.animation = 'shake .4s ease'; });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     VYOM+ OVERLAY
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const plusOverlay       = document.getElementById('vyomPlusOverlay');
  const plusBtn           = document.getElementById('getVyomPlusBtn');
  const mobileVyomPlusBtn = document.getElementById('mobileVyomPlusBtn');
  const closePlusM        = document.getElementById('closePlusModal');
  const closePlusBtn      = document.getElementById('closePlusBtn');

  function openPlus() {
    if (plusOverlay) plusOverlay.classList.add('active');
    if (mobileDrawer) mobileDrawer.classList.remove('open');
    if (hamburger)    hamburger.classList.remove('open');
  }
  if (plusBtn)           plusBtn.addEventListener('click', openPlus);
  if (mobileVyomPlusBtn) mobileVyomPlusBtn.addEventListener('click', e => { e.preventDefault(); openPlus(); });
  if (closePlusM)        closePlusM.addEventListener('click', () => plusOverlay.classList.remove('active'));
  if (closePlusBtn)      closePlusBtn.addEventListener('click', () => plusOverlay.classList.remove('active'));
  if (plusOverlay)       plusOverlay.addEventListener('click', e => { if (e.target === plusOverlay) plusOverlay.classList.remove('active'); });

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     ESCAPE — close everything
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (plusOverlay)    plusOverlay.classList.remove('active');
      if (bmOverlay)      bmOverlay.classList.remove('active');
      if (addBmOverlay)   addBmOverlay.classList.remove('active');
      if (dotMenu)        dotMenu.classList.remove('open');
      closeResults();
    }
  });

})();
