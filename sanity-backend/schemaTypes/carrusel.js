import { defineField, defineType } from 'sanity'

export const carruselType = defineType({
  name: 'carrusel',
  title: 'Carrusel',
  type: 'document',
  fields: [
    defineField({
      name: 'imagen',
      title: 'Imagen',
      type: 'image',
      options: { hotspot: true },
      validation: r => r.required()
    }),
    defineField({
      name: 'orden',
      title: 'Orden',
      type: 'number',
      validation: r => r.required().integer().positive()
    })
  ]
})
