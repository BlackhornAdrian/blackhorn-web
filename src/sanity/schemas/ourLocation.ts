import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'ourLocation',
  title: 'Our Location',
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
      name: 'address',
      title: 'Office Address',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      initialValue: '+852 2709 1388',
    }),
    defineField({
      name: 'email',
      title: 'General Email',
      type: 'string',
      initialValue: 'info@blackhorngrp.com',
    }),
    // ── Chinese translations ──────────────────────────────────────────
    defineField({
      name: 'address_zh',
      title: 'Office Address (Chinese)',
      type: 'text',
      rows: 3,
      fieldset: 'chinese',
    }),
    defineField({
      name: 'companyName_zh',
      title: 'Company Name (Chinese)',
      type: 'string',
      initialValue: '晉羚財富管理有限公司',
      fieldset: 'chinese',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Our Location' }
    },
  },
})
