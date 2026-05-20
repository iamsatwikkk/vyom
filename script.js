/* ── VYOM script.js ── */
(function () {

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     DEV MODE SPLASH
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const devSplash = document.getElementById('devSplash');
  const devEnterBtn = document.getElementById('devEnterBtn');
  if (devSplash && devEnterBtn) {
    // Show splash on every visit (remove sessionStorage line to always show)
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
     HAMBURGER MOBILE NAV
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const hamburger   = document.getElementById('hamburgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  if (hamburger && mobileDrawer) {
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileDrawer.classList.contains('open');
      mobileDrawer.classList.toggle('open', !isOpen);
      hamburger.classList.toggle('open', !isOpen);
    });
    // Close drawer on outside click
    document.addEventListener('click', (e) => {
      if (!mobileDrawer.contains(e.target) && e.target !== hamburger) {
        mobileDrawer.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });
  }

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
     SEARCH
     — Bing: loads in iframe (allows it)
     — All others: same-tab navigation
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  const searchInput        = document.getElementById('searchInput');
  const searchForm         = document.getElementById('searchForm');
  const searchResultsWrap  = document.getElementById('searchResultsWrap');
  const resultsIframe      = document.getElementById('resultsIframe');
  const resultsBackBtn     = document.getElementById('resultsBackBtn');
  const resultsSearchInput = document.getElementById('resultsSearchInput');
  const resultsSearchBtn   = document.getElementById('resultsSearchBtn');

  let currentEngineUrl    = 'https://www.bing.com/search?q=';
  let currentUseIframe    = true;   // Bing is default

  const placeholderMap = {
    google:     'Search with Google…',
    bing:       'Search with Bing…',
    duckduckgo: 'Search privately with DuckDuckGo…',
    brave:      'Search with Brave…',
    yahoo:      'Search with Yahoo…',
    ecosia:     'Plant trees while you search…'
  };

  if (searchInput) {
    // Engine tab switching
    document.querySelectorAll('.engine-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentEngineUrl = tab.dataset.url;
        currentUseIframe = tab.dataset.iframe === 'true';
        searchInput.placeholder = placeholderMap[tab.dataset.engine] || 'Where do you want to go today?';
      });
    });

    // Submit
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) { shakeBox(); return; }
      doSearch(q);
    });

    // "/" shortcut
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault(); searchInput.focus();
      }
    });
  }

  // Re-search from results bar
  if (resultsSearchBtn) {
    resultsSearchBtn.addEventListener('click', () => {
      const q = resultsSearchInput.value.trim();
      if (q) doSearch(q);
    });
  }
  if (resultsSearchInput) {
    resultsSearchInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const q = resultsSearchInput.value.trim();
        if (q) doSearch(q);
      }
    });
  }

  // Back to VYOM
  if (resultsBackBtn) {
    resultsBackBtn.addEventListener('click', closeResults);
  }

  function doSearch(query) {
    const url = currentEngineUrl + encodeURIComponent(query);
    if (currentUseIframe && searchResultsWrap && resultsIframe) {
      // Bing — load inside iframe
      resultsIframe.src = url;
      if (resultsSearchInput) resultsSearchInput.value = query;
      searchResultsWrap.classList.add('active');
    } else {
      // All other engines — navigate same tab (press Back to return)
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
  const plusOverlay  = document.getElementById('vyomPlusOverlay');
  const plusBtn      = document.getElementById('getVyomPlusBtn');
  const mobileVyomPlusBtn = document.getElementById('mobileVyomPlusBtn');
  const closePlusM   = document.getElementById('closePlusModal');
  const closePlusBtn = document.getElementById('closePlusBtn');

  function openPlus() {
    if (plusOverlay) plusOverlay.classList.add('active');
    if (mobileDrawer) { mobileDrawer.classList.remove('open'); }
    if (hamburger)    { hamburger.classList.remove('open'); }
  }

  if (plusBtn) plusBtn.addEventListener('click', openPlus);
  if (mobileVyomPlusBtn) mobileVyomPlusBtn.addEventListener('click', e => { e.preventDefault(); openPlus(); });
  if (closePlusM)   closePlusM.addEventListener('click',   () => plusOverlay.classList.remove('active'));
  if (closePlusBtn) closePlusBtn.addEventListener('click', () => plusOverlay.classList.remove('active'));
  if (plusOverlay)  plusOverlay.addEventListener('click',  e => { if (e.target === plusOverlay) plusOverlay.classList.remove('active'); });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (plusOverlay) plusOverlay.classList.remove('active');
      closeResults();
    }
  });

})();