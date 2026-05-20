/* ── VYOM script.js ── */
(function () {

  // ── Search engine switcher (index only) ──
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    let currentEngine = { name: 'google', url: 'https://www.google.com/search?q=' };

    document.querySelectorAll('.engine-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.engine-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentEngine.name = tab.dataset.engine;
        currentEngine.url  = tab.dataset.url;
        const map = {
          google:     'Search with Google…',
          bing:       'Search with Bing…',
          duckduckgo: 'Search privately with DuckDuckGo…',
          brave:      'Search with Brave…',
          yahoo:      'Search with Yahoo…',
          ecosia:     'Plant trees while you search…'
        };
        searchInput.placeholder = map[currentEngine.name] || 'Where do you want to go today?';
      });
    });

    document.getElementById('searchForm').addEventListener('submit', e => {
      e.preventDefault();
      const q = searchInput.value.trim();
      if (!q) { shakeBox(); return; }
      window.open(currentEngine.url + encodeURIComponent(q), '_blank', 'noopener,noreferrer');
    });

    // Press "/" to focus search
    document.addEventListener('keydown', e => {
      if (e.key === '/' && document.activeElement !== searchInput) {
        e.preventDefault(); searchInput.focus();
      }
    });

    function shakeBox() {
      const b = document.querySelector('.search-box');
      b.style.animation = 'none';
      requestAnimationFrame(() => { b.style.animation = 'shake .4s ease'; });
    }
  }

  // ── VYOM+ overlay ──
  const plusOverlay  = document.getElementById('vyomPlusOverlay');
  const plusBtn      = document.getElementById('getVyomPlusBtn');
  const closePlusM   = document.getElementById('closePlusModal');
  const closePlusBtn = document.getElementById('closePlusBtn');

  if (plusOverlay && plusBtn) {
    plusBtn.addEventListener('click', () => plusOverlay.classList.add('active'));
    if (closePlusM)   closePlusM.addEventListener('click',   () => plusOverlay.classList.remove('active'));
    if (closePlusBtn) closePlusBtn.addEventListener('click', () => plusOverlay.classList.remove('active'));
    plusOverlay.addEventListener('click', e => {
      if (e.target === plusOverlay) plusOverlay.classList.remove('active');
    });
  }

  // Escape closes overlay
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && plusOverlay) plusOverlay.classList.remove('active');
  });

})();