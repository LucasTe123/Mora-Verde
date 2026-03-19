function initCarousel(slides) {
  const el = document.getElementById('carrusel');
  if (!el) return;

  const defaultSlides = slides || [
    { title: '', subtitle: '', bg: '#2d5a3d' },
    { title: '', subtitle: '', bg: '#3d6b50' },
    { title: '', subtitle: '', bg: '#4a7c59' },
  ];

  el.innerHTML = `
    <div class="carousel">
      <div class="carousel__track" id="carousel-track">
        ${defaultSlides.map((s, i) => `
          <div class="carousel__slide">
            ${s.image
              ? `<img src="${s.image}" alt="${s.title}" />`
              : `<div style="width:100%;height:100%;background:${s.bg || '#2d5a3d'}"></div>`
            }
          </div>
        `).join('')}
      </div>
      <button class="carousel__btn carousel__btn--prev" id="carousel-prev">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>
      <button class="carousel__btn carousel__btn--next" id="carousel-next">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>
      <div class="carousel__dots" id="carousel-dots">
        ${defaultSlides.map((_, i) => `<button class="carousel__dot ${i === 0 ? 'active' : ''}" data-index="${i}"></button>`).join('')}
      </div>
    </div>
  `;

  let current = 0;
  const track = document.getElementById('carousel-track');
  const dots = document.querySelectorAll('.carousel__dot');
  let autoTimer;

  function goTo(index) {
    current = (index + defaultSlides.length) % defaultSlides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1), 4000); }
  function stopAuto() { clearInterval(autoTimer); }

  document.getElementById('carousel-prev').addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  document.getElementById('carousel-next').addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });
  dots.forEach(d => d.addEventListener('click', () => { stopAuto(); goTo(+d.dataset.index); startAuto(); }));

  // ── Swipe táctil ──
  let touchStartX = 0;
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      stopAuto();
      goTo(diff > 0 ? current + 1 : current - 1);
      startAuto();
    }
  }, { passive: true });

  startAuto();
}
