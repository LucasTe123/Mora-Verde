import { defineField, defineType } from 'sanity'

export const asesoriaType = defineType({
  name: 'asesoria',
  title: 'Asesoría',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título',
      type: 'string',
      description: 'Título que aparece encima de las fotos',
      validation: r => r.required()
    }),

    defineField({
      name: 'foto1',
      title: 'Foto 1',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'foto2',
      title: 'Foto 2',
      type: 'image',
      options: { hotspot: true },
    }),

    defineField({
      name: 'foto3',
      title: 'Foto 3',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'titulo', media: 'foto1' }
  }
})