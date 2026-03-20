function mostrarSkeleton(container, cantidad = 4) {
  container.innerHTML = '';
  for (let i = 0; i < cantidad; i++) {
    const sk = document.createElement('div');
    sk.className = 'product-card';
    sk.innerHTML = `
      <div class="skeleton" style="aspect-ratio:1;width:100%"></div>
      <div style="padding:14px;display:flex;flex-direction:column;gap:8px">
        <div class="skeleton" style="height:14px;width:80%;border-radius:4px"></div>
        <div class="skeleton" style="height:18px;width:50%;border-radius:4px"></div>
        <div class="skeleton" style="height:36px;width:100%;border-radius:8px;margin-top:4px"></div>
      </div>
    `;
    container.appendChild(sk);
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  const page = detectPage();


  // ── HOME ──
  if (page === 'home') {
    const container = document.getElementById('lista-nuevos');
    if (!container) return;
    mostrarSkeleton(container, 4);
    const raw = await getProductosNuevos();
    container.innerHTML = '';
    if (!raw.length) {
      container.innerHTML = '<p style="color:#888;padding:16px">No hay productos nuevos por ahora.</p>';
      return;
    }
    raw.map(normalizarProducto).forEach(p => container.appendChild(createProductCard(p)));
  }


  // ── CATÁLOGO ──
  if (page === 'catalogo') {
    const container = document.getElementById('lista-categorias');
    const sidebar = document.querySelector('.catalog-sidebar');
    if (!container) return;

    mostrarSkeleton(container, 8);

    if (sidebar) {
      sidebar.innerHTML = '<h3>Categorías</h3>';

      const homeA = document.createElement('a');
      homeA.href = 'index.html';
      homeA.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align:middle;margin-right:5px">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>Inicio`;
      sidebar.appendChild(homeA);

      const allA = document.createElement('a');
      allA.href = 'catalogo.html';
      allA.textContent = 'Todos los productos';
      allA.classList.add('active');
      sidebar.appendChild(allA);

      const cats = await getCategorias();
      cats.forEach(c => {
        const a = document.createElement('a');
        a.href = `categoria.html?cat=${c.slug}`;
        a.textContent = c.nombre;
        sidebar.appendChild(a);
      });
    }

    const raw = await getProductos();
    container.innerHTML = '';
    if (!raw.length) {
      container.innerHTML = '<p style="color:#888;padding:16px;grid-column:1/-1">No hay productos cargados.</p>';
      return;
    }
    raw.map(normalizarProducto).forEach(p => container.appendChild(createProductCard(p)));
  }


  // ── CATEGORÍA ──
  if (page === 'categoria') {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('cat') || '';
    const objetivo = params.get('objetivo') || '';
    const titulo = document.getElementById('titulo-categoria');
    const desc = document.getElementById('desc-categoria');
    const container = document.getElementById('lista-productos');
    if (!container) return;

    mostrarSkeleton(container, 6);

    if (objetivo) {
      const titulos = {
        'ganar-peso': 'Ganar Peso',
        'vida-saludable': 'Vida Saludable',
        'consultas': 'Consultas'
      };
      if (titulo) titulo.textContent = titulos[objetivo] || objetivo;

      const raw = await getProductosPorObjetivo(objetivo);
      container.innerHTML = '';
      if (!raw.length) {
        container.innerHTML = '<p style="color:#888;padding:16px;grid-column:1/-1">No hay productos en este objetivo aún.</p>';
        if (desc) desc.textContent = '0 productos';
        return;
      }
      const productos = raw.map(normalizarProducto);
      if (desc) desc.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''}`;
      productos.forEach(p => container.appendChild(createProductCard(p)));
      return;
    }

    const cats = await getCategorias();
    const catActual = cats.find(c => c.slug === slug);
    if (titulo) titulo.textContent = catActual?.nombre || slug.replace(/-/g, ' ');

    const raw = await getProductosPorCategoria(slug);
    container.innerHTML = '';
    if (!raw.length) {
      container.innerHTML = '<p style="color:#888;padding:16px;grid-column:1/-1">No hay productos en esta categoría.</p>';
      if (desc) desc.textContent = '0 productos';
      return;
    }
    const productos = raw.map(normalizarProducto);
    if (desc) desc.textContent = `${productos.length} producto${productos.length !== 1 ? 's' : ''}`;
    productos.forEach(p => container.appendChild(createProductCard(p)));
  }


  // ── PRODUCTO DETALLE ──
  if (page === 'producto') {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (!id) return;

    const raw = await getProductoPorId(id);
    if (!raw) return;
    const product = normalizarProducto(raw);

    const urlProducto = `https://moraverde.online/producto.html?id=${id}`;

    function setMeta(selector, value) {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        const attr = selector.includes('og:') ? 'property' : 'name';
        el.setAttribute(attr, selector.match(/["']([^"']+)["']/)[1]);
        document.head.appendChild(el);
      }
      el.setAttribute('content', value);
    }

    setMeta('meta[property="og:title"]',       `${product.name} | Organic Life`);
    setMeta('meta[property="og:description"]', product.description || 'Producto de alta calidad.');
    setMeta('meta[property="og:image"]',        product.image);
    setMeta('meta[property="og:url"]',          urlProducto);
    setMeta('meta[property="og:type"]',         'product');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = urlProducto;

    document.title = `${product.name} | Organic Life`;
    document.getElementById('detail-brand').textContent = product.categoryName || 'Organic Life';
    document.getElementById('detail-name').textContent = product.name;

    const priceEl = document.getElementById('detail-price');
    if (priceEl) priceEl.textContent = `$${Number(product.price).toFixed(2)}`;

    document.getElementById('detail-desc').textContent = product.description || 'Producto de alta calidad.';

    const mainImg = document.getElementById('main-img');
    const thumbs = document.getElementById('thumbs');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const images = product.images?.length ? product.images : [product.image];
    let currentIndex = 0;

    if (mainImg) {
      mainImg.src = images[0];

      if (images.length > 1) {
        if (btnPrev) btnPrev.style.display = 'block';
        if (btnNext) btnNext.style.display = 'block';
      }

      let startX = 0;
      mainImg.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
      mainImg.addEventListener('touchend', e => {
        const diff = startX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex < images.length - 1) currentIndex++;
          else if (diff < 0 && currentIndex > 0) currentIndex--;
          mainImg.src = images[currentIndex];
          actualizarThumbs();
        }
      });

      mainImg.addEventListener('mousedown', e => { startX = e.clientX; });
      mainImg.addEventListener('mouseup', e => {
        const diff = startX - e.clientX;
        if (Math.abs(diff) > 50) {
          if (diff > 0 && currentIndex < images.length - 1) currentIndex++;
          else if (diff < 0 && currentIndex > 0) currentIndex--;
          mainImg.src = images[currentIndex];
          actualizarThumbs();
        }
      });
    }

    function actualizarThumbs() {
      if (!thumbs) return;
      thumbs.querySelectorAll('button').forEach((b, j) => {
        b.style.borderColor = j === currentIndex ? '#4a7c59' : 'transparent';
      });
    }

    window.cambiarFoto = function(dir) {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      mainImg.src = images[currentIndex];
      actualizarThumbs();
    };

    if (thumbs && images.length > 1) {
      thumbs.innerHTML = '';
      images.forEach((src, i) => {
        const btn = document.createElement('button');
        btn.style.cssText = 'background:none;border:2px solid transparent;padding:2px;border-radius:6px;cursor:pointer';
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = 'width:60px;height:60px;object-fit:cover;border-radius:4px';
        btn.appendChild(img);
        btn.onclick = () => { currentIndex = i; mainImg.src = src; actualizarThumbs(); };
        if (i === 0) btn.style.borderColor = '#4a7c59';
        thumbs.appendChild(btn);
      });
    }

    const infoList = document.getElementById('detail-info');
    if (infoList) {
      infoList.innerHTML = '';
      [`Precio: $${Number(product.price).toFixed(2)}`, `Categoría: ${product.categoryName}`]
        .forEach(txt => {
          const li = document.createElement('li');
          li.textContent = txt;
          infoList.appendChild(li);
        });
    }

    // ── PRESENTACIONES ──
    const presentacionesContainer = document.getElementById('detail-presentaciones');
    if (presentacionesContainer && product.presentaciones?.length) {
      presentacionesContainer.innerHTML = '';

      const titPres = document.createElement('p');
      titPres.textContent = 'PRESENTACIONES DISPONIBLES';
      titPres.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:1px;color:#888;margin:0 0 10px 0';
      presentacionesContainer.appendChild(titPres);

      const botonesPres = document.createElement('div');
      botonesPres.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';

      product.presentaciones.forEach(p => {
        const btn = document.createElement('div');
        btn.textContent = p;
        btn.style.cssText = `
          padding: 8px 18px;
          border-radius: 8px;
          border: 2px solid #ddd;
          font-weight: 400;
          font-size: 14px;
          background: #fff;
          color: #444;
          cursor: default;
        `;
        botonesPres.appendChild(btn);
      });

      presentacionesContainer.appendChild(botonesPres);
    }

    // ── SABORES ──
    const saboresContainer = document.getElementById('detail-sabores');
    if (saboresContainer && product.sabores?.length) {
      saboresContainer.innerHTML = '';

      const titSab = document.createElement('p');
      titSab.textContent = 'SABORES DISPONIBLES';
      titSab.style.cssText = 'font-size:11px;font-weight:600;letter-spacing:1px;color:#888;margin:0 0 10px 0';
      saboresContainer.appendChild(titSab);

      const botonesSab = document.createElement('div');
      botonesSab.style.cssText = 'display:flex;flex-wrap:wrap;gap:8px';

      product.sabores.forEach(s => {
        const btn = document.createElement('div');
        btn.textContent = s;
        btn.style.cssText = `
          padding: 8px 18px;
          border-radius: 8px;
          border: 2px solid #ddd;
          font-weight: 400;
          font-size: 14px;
          background: #fff;
          color: #444;
          cursor: default;
        `;
        botonesSab.appendChild(btn);
      });

      saboresContainer.appendChild(botonesSab);
    }

    const waLink = document.getElementById('detail-wa');
    if (waLink) waLink.href = buildWaUrl(product);
  }
});


function detectPage() {
  const path = window.location.pathname;
  if (path.includes('catalogo')) return 'catalogo';
  if (path.includes('categoria')) return 'categoria';
  if (path.includes('producto')) return 'producto';
  return 'home';
}
