async function renderAsesoria() {
  const container = document.getElementById('pilares-container');
  if (!container) return;

  const data = await sanityFetch(`*[_type == "asesoria"][0]{
    pilar1{ nombre, imagen },
    pilar2{ nombre, imagen },
    pilar3{ nombre, imagen }
  }`);

  if (!data) {
    container.innerHTML = '<p style="text-align:center;color:#999">Sin datos aún.</p>';
    return;
  }

  const pilares = [
    { numero: '01', ...data.pilar1 },
    { numero: '02', ...data.pilar2 },
    { numero: '03', ...data.pilar3 }
  ].filter(p => p.nombre);

  container.innerHTML = pilares.map(p => {
    const imgUrl = sanityImageUrl(p.imagen);
    return `
      <div class="pilar-card">
        <div class="pilar-card__top">
          <h3 class="pilar-card__nombre">${p.nombre.toUpperCase()}</h3>
        </div>
        <div class="pilar-card__img-wrap">
          <img src="${imgUrl}" alt="${p.nombre}" />
        </div>
        <div class="pilar-card__footer">
          <div class="pilar-card__bar"></div>
        </div>
      </div>
    `;
  }).join('');
}

renderAsesoria();
