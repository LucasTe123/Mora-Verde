import { defineField, defineType } from 'sanity'

export const productoType = defineType({
  name: 'producto',
  title: 'Producto',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: r => r.required()
    }),

    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text'
    }),

    // Campo legacy — oculto, no se borra para no perder datos
    defineField({
      name: 'imagen',
      title: 'Imagen (legacy)',
      type: 'image',
      hidden: true,
    }),

    defineField({
      name: 'imagenes',
      title: 'Imágenes del producto',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: r => r.min(1).max(5)
    }),

    // ── MÚLTIPLES CATEGORÍAS ──
    defineField({
      name: 'categorias',
      title: 'Categorías',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'categoria' }] }],
      validation: r => r.required().min(1)
    }),

    // Campo legacy — oculto para no perder datos anteriores
    defineField({
      name: 'categoria',
      title: 'Categoría (legacy)',
      type: 'reference',
      to: [{ type: 'categoria' }],
      hidden: true,
    }),

    // ── PRESENTACIONES DEL PRODUCTO ──
    defineField({
      name: 'presentaciones',
      title: 'Presentaciones disponibles',
      description: 'Ej: 500gr, 600gr, 1kg, 250ml — agregá una por una',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'presentacion',
          title: 'Presentación',
          fields: [
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
              description: 'Ej: 500gr, 1kg, 250ml',
              validation: r => r.required()
            })
          ],
          preview: {
            select: { title: 'etiqueta' }
          }
        }
      ]
    }),

    // ── SABORES DEL PRODUCTO ──
    defineField({
      name: 'sabores',
      title: 'Sabores disponibles',
      description: 'Ej: Frutilla, Chocolate, Natural — agregá uno por uno',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'sabor',
          title: 'Sabor',
          fields: [
            defineField({
              name: 'etiqueta',
              title: 'Etiqueta',
              type: 'string',
              description: 'Ej: Frutilla, Mango, Sin sabor',
              validation: r => r.required()
            })
          ],
          preview: {
            select: { title: 'etiqueta' }
          }
        }
      ]
    }),

    defineField({
      name: 'esNuevo',
      title: '¿Es producto nuevo?',
      type: 'boolean',
      initialValue: false
    }),

    defineField({
      name: 'fechaCreacion',
      title: 'Fecha de creación',
      type: 'datetime'
    }),

    defineField({
      name: 'objetivo',
      title: 'Objetivo',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Ganar peso', value: 'ganar-peso' },
          { title: 'Vida saludable', value: 'vida-saludable' },
          { title: 'Consultas', value: 'consultas' },
        ],
        layout: 'grid'
      }
    }),
  ]
})
