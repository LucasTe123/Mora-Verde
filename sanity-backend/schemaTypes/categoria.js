import { defineField, defineType } from 'sanity'

export const categoriaType = defineType({
  name: 'categoria',
  title: 'Categoría',
  type: 'document',
  fields: [
    defineField({ name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nombre' }, validation: r => r.required() })
  ]
})
