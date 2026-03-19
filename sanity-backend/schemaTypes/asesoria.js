import { defineField, defineType } from 'sanity'

export const asesoriaType = defineType({
  name: 'asesoria',
  title: 'Asesoría Nutricional',
  type: 'document',
  fields: [
    defineField({
      name: 'pilar1',
      title: 'Pilar 1',
      type: 'object',
      fields: [
        { name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() },
        { name: 'imagen', title: 'Imagen', type: 'image', options: { hotspot: true }, description: '📐 Subí una foto VERTICAL (600x800px o similar). Se recortará automáticamente.', validation: r => r.required() }
      ]
    }),
    defineField({
      name: 'pilar2',
      title: 'Pilar 2',
      type: 'object',
      fields: [
        { name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() },
        { name: 'imagen', title: 'Imagen', type: 'image', options: { hotspot: true }, description: '📐 Subí una foto VERTICAL (600x800px o similar). Se recortará automáticamente.', validation: r => r.required() }
      ]
    }),
    defineField({
      name: 'pilar3',
      title: 'Pilar 3',
      type: 'object',
      fields: [
        { name: 'nombre', title: 'Nombre', type: 'string', validation: r => r.required() },
        { name: 'imagen', title: 'Imagen', type: 'image', options: { hotspot: true }, description: '📐 Subí una foto VERTICAL (600x800px o similar). Se recortará automáticamente.', validation: r => r.required() }
      ]
    }),
  ],
  preview: {
    select: { title: 'pilar1.nombre', media: 'pilar1.imagen' }
  }
})
