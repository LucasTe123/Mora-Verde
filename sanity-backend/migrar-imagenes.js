import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '4jtgmghb', // tu project ID
  dataset: 'production',
  apiVersion: '2026-03-16',
  token: 'skODyJZGAFljLyGG6zBXzNaUNgPS8exr08qVwE5h5k7r8uALzQNKN3Vd2RDCE489wuoc2wAFJtUYptAYlJfvgEiRLNaz5QAMj8zuN4OQRvaoUtCAacn3R4PqpO25dNfS8plpwf4OAeddroeQL410JgBd07vrDGZ8zuK2NuzGbrmZi2Nx8SQU', // 👈 aquí va tu token
  useCdn: false,
})

const productos = await client.fetch(
  `*[_type == "producto" && defined(imagen) && !defined(imagenes)]{ _id, imagen }`
)

console.log(`Migrando ${productos.length} productos...`)

for (const producto of productos) {
  await client.patch(producto._id).set({
    imagenes: [
      {
        _type: 'image',
        _key: producto._id.slice(0, 8),
        asset: producto.imagen.asset,
      }
    ]
  }).commit()

  console.log(`✅ Migrado: ${producto._id}`)
}

console.log('¡Listo! Todos los productos migrados.')
