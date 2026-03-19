function renderNavbar() {
  const navbarEl = document.getElementById('navbar');
  if (!navbarEl) return;

  const esHome =
    window.location.pathname === '/' ||
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname.endsWith('/');

  navbarEl.innerHTML = `
   <nav class="navbar navbar--centered">
  <div class="navbar__side-spacer"></div>
  <a href="index.html" class="navbar__logo">
    <img src="assets/55.png" alt="Mora Verde" style="height:60px;width:auto;display:block;" />
  </a>
  <div class="navbar__actions">
    <a href="asesoria.html" class="navbar__side-link">Asesoría Nutricional</a>
    <a href="consultoria.html" class="navbar__side-link">Consultoría</a>
    <button class="navbar__search-toggle" id="search-toggle-btn" aria-label="Buscar">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
      </svg>
    </button>
    <button class="navbar__hamburger" id="hamburger-btn" aria-label="Menú">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<div class="navbar__search-mobile" id="navbar-search-mobile">
  <div class="navbar__search-mobile-inner">
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input type="text" id="search-input-mobile" placeholder="Buscar producto..." autocomplete="off" />
    <button id="search-close-btn">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
    </button>
  </div>
  <div id="search-results-mobile" class="search-dropdown" style="display:none"></div>
</div>

    <div class="sidebar-overlay" id="sidebar-overlay"></div>
    <aside class="sidebar" id="sidebar">
      <div class="sidebar__close" id="sidebar-close">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </div>
      <div class="sidebar__logo">Mora Verde</div>
      <nav id="sidebar-nav">
        <a href="index.html">Inicio</a>
        <a href="catalogo.html">Catálogo</a>
      </nav>
    </aside>
  `;

  // ── Hamburger ──
  document.getElementById('hamburger-btn').addEventListener('click', () => {
    document.getElementById('sidebar').classList.add('open');
    document.getElementById('sidebar-overlay').classList.add('active');
  });
  document.getElementById('sidebar-close').addEventListener('click', cerrarSidebar);
  document.getElementById('sidebar-overlay').addEventListener('click', cerrarSidebar);

  function cerrarSidebar() {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('sidebar-overlay').classList.remove('active');
  }

  // ── Categorías en sidebar mobile con íconos ──
  const SLUG_ICONS_MOBILE = {
    'aceites-y-vinagres':           '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10"/><path d="M12 2c0 5.5-4 10-4 10s4 4.5 4 10"/></svg>',
    'endulzantes-naturales':        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M2 12h2"/><path d="M20 12h2"/></svg>',
    'frutos secos ':                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4a8 8 0 0 1 7.56 10.68A4 4 0 0 1 16 22H8a4 4 0 0 1-3.56-7.32A8 8 0 0 1 12 4z"/><path d="M12 4v18"/></svg>',
    'harinas saludables':           '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 22L16 8"/><path d="M8 8c0 0 1-5 6-6"/><path d="M16 8c0 0 5-1 6-6"/><path d="M12 14c0 0-5 1-6 6"/></svg>',
    'infusiones y tés ':            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/></svg>',
    'postres sin azúcar ':          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"/><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"/><path d="M2 21h20"/></svg>',
    'premezclas-en-polvo':          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4l-9-5.19"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><path d="M12 22.08V12"/></svg>',
    'probioticos-kombucha-kefir':   '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V2"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>',
    'productos congelados':         '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><path d="M20 16l-4-4 4-4"/><path d="M4 8l4 4-4 4"/><path d="M16 4l-4 4-4-4"/><path d="M8 20l4-4 4 4"/></svg>',
    'productos sin gluten':         '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
    'productos sin lactosa':        '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 2h8"/><path d="M9 2v1.343"/><path d="M15 2v2.789a4 4 0 0 0 .672 2.219l4.656 6.983"/><path d="M7.8 7.8L3 16a2 2 0 0 0 1.73 3h14.54"/><line x1="2" y1="2" x2="22" y2="22"/></svg>',
    'productos veganos':            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
    'semillas - cereales - granos': '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/></svg>',
    'snacks saludables':            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/></svg>',
    'untables':                     '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3zm0 0v7"/></svg>',
    'vitaminas':                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z"/><path d="m8.5 8.5 7 7"/></svg>',
    'yogures':                      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8"/><path d="M5 8h14"/><path d="M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0"/></svg>',
  };
  const DEFAULT_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';

  function getMobileIcon(slug) {
    if (SLUG_ICONS_MOBILE[slug]) return SLUG_ICONS_MOBILE[slug];
    const n = slug.toLowerCase().trim();
    for (const k of Object.keys(SLUG_ICONS_MOBILE)) {
      if (k.toLowerCase().trim() === n) return SLUG_ICONS_MOBILE[k];
    }
    return DEFAULT_ICON;
  }

  getCategorias().then(cats => {
    const nav = document.getElementById('sidebar-nav');
    if (!nav || !cats.length) return;
    cats.forEach(c => {
      const a = document.createElement('a');
      a.href = `categoria.html?cat=${c.slug}`;
      a.innerHTML = `${getMobileIcon(c.slug)} ${c.nombre}`;
      nav.appendChild(a);
    });
  });

  // ── Search ──
  let allProducts = [];
  let searchTimer;

  getProductos().then(raw => { allProducts = raw.map(p => normalizarProducto(p)); });

  // ── Search desktop ──
  setTimeout(() => {
    const searchInput   = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');


    if (searchInput && searchResults) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
          const q = searchInput.value.trim().toLowerCase();
          if (!q) { searchResults.style.display = 'none'; return; }
          const found = allProducts.filter(p => p.name.toLowerCase().startsWith(q));
          searchResults.innerHTML = !found.length
            ? `<div class="search-empty">Sin resultados para "${q}"</div>`
            : found.slice(0, 6).map(p => `
                <a class="search-item" href="producto.html?id=${p.id}">
                  <img src="${p.image}" alt="${p.name}" />
                  <div>
                    <div class="search-item__name">${p.name}</div>
                  </div>
                </a>`).join('');
          searchResults.style.display = 'block';
        }, 280);
      });

      document.addEventListener('click', e => {
        if (!e.target.closest('.home-search-row') && !e.target.closest('.navbar__search')) {
          searchResults.style.display = 'none';
        }
      });
    }
  }, 0);

  // ── Search mobile ──
  const searchToggleBtn = document.getElementById('search-toggle-btn');
  const searchMobile    = document.getElementById('navbar-search-mobile');
  const searchCloseBtn  = document.getElementById('search-close-btn');
  const searchInputMob  = document.getElementById('search-input-mobile');

  searchToggleBtn?.addEventListener('click', () => {
    searchMobile.classList.toggle('open');
    if (searchMobile.classList.contains('open')) setTimeout(() => searchInputMob.focus(), 150);
  });

  searchCloseBtn?.addEventListener('click', () => {
    searchMobile.classList.remove('open');
    const sr = document.getElementById('search-results-mobile');
    if (sr) sr.style.display = 'none';
  });

  searchInputMob?.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const q = searchInputMob.value.trim().toLowerCase();
      const searchResults = document.getElementById('search-results-mobile');
      if (!searchResults) return;
      if (!q) { searchResults.style.display = 'none'; return; }
      // DESPUÉS:
const found = allProducts.filter(p =>
  p.name.toLowerCase().startsWith(q)
);

      searchResults.innerHTML = !found.length
        ? `<div class="search-empty">Sin resultados para "${q}"</div>`
        : found.slice(0, 6).map(p => `
            <a class="search-item" href="producto.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}" />
              <div>
                <div class="search-item__name">${p.name}</div>
                <div class="search-item__price">$${Number(p.price).toFixed(2)}</div>
              </div>
            </a>`).join('');
      searchResults.style.display = 'block';
    }, 280);
  });
}