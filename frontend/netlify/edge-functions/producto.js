export default async (request, context) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id) return context.next();

  const SANITY_URL = `https://4jtgmghb.api.sanity.io/v2026-03-05/data/query/production`;
  const query = `*[_type == "producto" && _id == "${id}"][0] {
    nombre, descripcion,
    "imagen": imagenes[0].asset->url
  }`;

  const res = await fetch(`${SANITY_URL}?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  const p = data.result;

  if (!p) return context.next();

  const html = await context.next();
  const text = await html.text();

  const modified = text
    .replace('content="Producto | Organic Life"', `content="${p.nombre} | Mora Verde"`)
    .replace('content="Productos naturales de calidad."', `content="${p.descripcion || 'Productos naturales de calidad.'}"`)
    .replace('content="https://moraverde.online/assets/55.jpg"', `content="${p.imagen}"`)
    .replace('content=""', `content="${request.url}"`);

  return new Response(modified, html);
};

export const config = { path: '/producto.html' };