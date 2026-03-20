const SANITY_PROJECT_ID = '4jtgmghb';
const SANITY_DATASET    = 'production';
const SANITY_API_VER    = '2026-03-05';
const WA_NUMBER         = '59175138123';

const SANITY_URL = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VER}/data/query/${SANITY_DATASET}`;

function sanityImageUrl(imageRef) {
  if (!imageRef?.asset?._ref) return null;
  const ref = imageRef.asset._ref;
  const [, id, dimensions, fmt] = ref.split('-');
  return `https://cdn.sanity.io/images/${SANITY_PROJECT_ID}/${SANITY_DATASET}/${id}-${dimensions}.${fmt}`;
}

async function sanityFetch(groqQuery) {
  try {
    const encoded = encodeURIComponent(groqQuery);
    const res = await fetch(`${SANITY_URL}?query=${encoded}`);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    return data.result;
  } catch (err) {
    console.error('Error fetching from Sanity:', err);
    return null;
  }
}

async function getProductos() {
  const query = `*[_type == "producto"] | order(_createdAt desc) {
    _id, nombre, descripcion, precio, imagen,
    "imagenes": imagenes[].asset->url,
    esNuevo, fechaCreacion,
    "categoria": categorias[0]->{ nombre, "slug": slug.current },
    "categorias": categorias[]->{ nombre, "slug": slug.current }
  }`;
  const data = await sanityFetch(query);
  return data || [];
}

async function getProductosNuevos() {
  const query = `*[_type == "producto" && esNuevo == true] | order(_createdAt desc) {
    _id, nombre, descripcion, precio, imagen,
    "imagenes": imagenes[].asset->url,
    esNuevo,
    "categoria": categorias[0]->{ nombre, "slug": slug.current },
    "categorias": categorias[]->{ nombre, "slug": slug.current }
  }`;
  const data = await sanityFetch(query);
  return data || [];
}

async function getProductosPorCategoria(slug) {
  const query = `*[_type == "producto" && "${slug}" in categorias[]->slug.current] | order(_createdAt desc) {
    _id, nombre, descripcion, precio, imagen,
    "imagenes": imagenes[].asset->url,
    esNuevo,
    "categoria": categorias[0]->{ nombre, "slug": slug.current },
    "categorias": categorias[]->{ nombre, "slug": slug.current }
  }`;
  const data = await sanityFetch(query);
  return data || [];
}

async function getCategorias() {
  const query = `*[_type == "categoria"] | order(nombre asc) {
    _id, nombre, "slug": slug.current
  }`;
  const data = await sanityFetch(query);
  return data || [];
}

async function getCarrusel() {
  const query = `*[_type == "carrusel"] | order(orden asc) {
    _id,
    "imagen": imagen.asset->url,
    orden
  }`;
  const data = await sanityFetch(query);
  return data || [];
}


async function getProductoPorId(id) {
  const query = `*[_type == "producto" && _id == "${id}"][0] {
    _id, nombre, descripcion, precio, imagen,
    "imagenes": imagenes[].asset->url,
    esNuevo, fechaCreacion,
    "presentaciones": presentaciones[].etiqueta,
    "categoria": categorias[0]->{ nombre, "slug": slug.current },
    "categorias": categorias[]->{ nombre, "slug": slug.current }
  }`;
  const data = await sanityFetch(query);
  return data || null;
}

async function getProductosPorObjetivo(objetivo) {
  const q = `*[_type == "producto" && "${objetivo}" in objetivo] | order(_createdAt desc) {
    _id, nombre, descripcion, precio, imagen,
    "imagenes": imagenes[].asset->url,
    esNuevo,
    "categoria": categoria->{ nombre, "slug": slug.current }
  }`;
  return await sanityFetch(q) || [];
}

function normalizarProducto(p) {
  try {
    let imagenUrl = 'img/placeholder.jpg';
    if (p.imagenes && p.imagenes[0]) {
      imagenUrl = p.imagenes[0];
    } else if (p.imagen) {
      imagenUrl = sanityImageUrl(p.imagen);
    }
 
    return {
      id: p._id,
      name: p.nombre || 'Producto sin nombre',
      image: imagenUrl,
      images: p.imagenes || [],
      price: p.precio || 0,
      description: p.descripcion || '',
      isNew: p.esNuevo === true,    // ← ESTA LÍNEA ES LA QUE FALTA
      categoryName: p.categorias && p.categorias[0] ? p.categorias[0].nombre : 'General',
      presentaciones: p.presentaciones || []
    };
  } catch (error) {
    console.error("Error normalizando producto:", error);
    return null;
  }
}


function buildWaUrl(product) {
  const urlProducto = `https://moraverde.online/producto.html?id=${product.id}`;
  const msg = encodeURIComponent(
    `Hola! Me interesa el producto: ${product.name}\n${urlProducto}`
  );
  return `https://wa.me/${WA_NUMBER}?text=${msg}`;
};
document.addEventListener('DOMContentLoaded', () => {
  if (typeof renderNavbar === 'function') renderNavbar();
});