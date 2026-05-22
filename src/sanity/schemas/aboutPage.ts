import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fieldsets: [
    {
      name: 'chinese',
      title: '中文 Chinese Translation',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'heroMessage',
      title: 'Hero Message',
      type: 'text',
      rows: 1,
    }),
    defineField({
      name: 'heroSubText',
      title: 'Hero Sub Text',
      type: 'text',
      rows: 4,
    }),
    // ── Chinese translations ──────────────────────────────────────────
    defineField({
      name: 'heroMessage_zh',
      title: 'Hero Message (Chinese)',
      type: 'text',
      fieldset: 'chinese',
      rows: 1,
    }),
    defineField({
      name: 'heroSubText_zh',
      title: 'Hero Sub Text (Chinese)',
      type: 'text',
      fieldset: 'chinese',
      rows: 4,
    }),
  ],
  preview: {
    prepare() {
      return { title: 'About Page' }
    },
  },
})
