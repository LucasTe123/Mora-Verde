function buildWaUrl(product) {
  const numero = '59175138123';
  const urlProducto = `https://moraverde.online/producto.html?id=${product.id}`;
  
  const msg = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name}\n${urlProducto}`
  );
  
  return `https://wa.me/${numero}?text=${msg}`;
}


function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'product-card';

  const badge = product.isNew ? '<span class="product-card__badge">Nuevo</span>' : '';

  card.innerHTML = `
    <div class="product-card__img-wrap" style="cursor:pointer">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      ${badge}
    </div>
    <div class="product-card__body">
      <div class="product-card__name">${product.name}</div>
    </div>
  `;

  card.querySelector('.product-card__img-wrap').addEventListener('click', () => {
    window.location.href = `producto.html?id=${product.id}`;
  });

  return card;
}
