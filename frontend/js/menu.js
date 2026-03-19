document.addEventListener('DOMContentLoaded', async () => {
  marcarPaginaActiva();
  iniciarMenuMobile();
  iniciarNavbarScroll();
  iniciarRevealScroll();
  iniciarFilterToggle();
  // ← YA NO llama a cargarCategoriasEnSidebar()
});

function marcarPaginaActiva() {
  const path = window.location.pathname.split('/').pop();
  const params = new URLSearchParams(window.location.search);
  const catActual = params.get('cat');

  document.querySelectorAll('.catalog-sidebar a, .sidebar nav a').forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href') || '';
    const esMismaPage = href.includes(path) && path !== '';
    const esMismaCategoria = catActual && href.includes(`cat=${catActual}`);
    if (esMismaPage || esMismaCategoria) link.classList.add('active');
  });
}

function iniciarMenuMobile() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar || !overlay) return;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') cerrarSidebar();
  });

  let touchStartX = 0;
  sidebar.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });
  sidebar.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientX - touchStartX > 60) cerrarSidebar();
  }, { passive: true });
}

function cerrarSidebar() {
  document.getElementById('sidebar')?.classList.remove('open');
  document.getElementById('sidebar-overlay')?.classList.remove('active');
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) cerrarSidebar();
});

function iniciarNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });
}

function iniciarRevealScroll() {
  const elements = document.querySelectorAll(
    '.section, .goal-card, .product-card, .category-header, .product-detail'
  );
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  elements.forEach(el => observer.observe(el));
}

function iniciarFilterToggle() {
  const btn = document.getElementById('filter-toggle');
  const panel = document.getElementById('sidebar-mobile');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => panel.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !panel.contains(e.target)) {
      panel.classList.remove('open');
    }
  });
}
