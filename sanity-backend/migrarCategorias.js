/**
 * migrarCategorias.js
 * Copia el campo "categoria" (singular) al nuevo campo "categorias" (array)
 * en todos los productos que todavía no tienen categorias asignadas.
 * 
 * USO:
 *   1. Poné este archivo en tu carpeta sanity-backend/
 *   2. Ejecutá: node migrarCategorias.js
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: '4jtgmghb',
  dataset: 'production',
  apiVersion: '2026-03-05',
  token: 'skQpoZWjjujE1IqvXiGjpf4yDWnN3Am41hZlWoi9TMgPIiRsLhqH6DvZmfH693CQ6dQQ2gj2dCLq1wWq0iJyqI2AGnIGclp1szUFmwuhViVMkPb8z5O5ot3PKOaMf1JCCaq2qdownSSASF5lsbkyrV9maIl1mBs0MYCem3q86JR7mYqbComJ',  // ← ver instrucciones abajo
  useCdn: false,
})

async function migrar() {
  console.log('Buscando productos con categoria (legacy) pero sin categorias...')

  // Traer todos los productos que tienen categoria vieja pero no tienen categorias nuevo
  const productos = await client.fetch(`
    *[_type == "producto" && defined(categoria) && (!defined(categorias) || count(categorias) == 0)] {
      _id, nombre, categoria
    }
  `)

  console.log(`Encontrados: ${productos.length} productos para migrar`)

  if (productos.length === 0) {
    console.log('No hay nada que migrar.')
    return
  }

  // Migrar cada producto
  for (const p of productos) {
    try {
      await client
        .patch(p._id)
        .set({
          categorias: [
            {
              _type: 'reference',
              _ref: p.categoria._ref,
              _key: Math.random().toString(36).slice(2),
            }
          ]
        })
        .commit()

      console.log(`✅ ${p.nombre}`)
    } catch (err) {
      console.error(`❌ Error en ${p.nombre}:`, err.message)
    }
  }

  console.log('\n¡Migración completada!')
}

migrar()