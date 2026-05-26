import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/sanity/schema'
import {
  Settings,
  Trophy,
  Users,
  Layers,
  Briefcase,
  Building2,
  Newspaper,
  CalendarDays,
  Mic,
  GraduationCap,
  Scale,
  MapPin,
  Telescope,
} from 'lucide-react'

export default defineConfig({
  name: 'blackhorn',
  title: 'Blackhorn Website',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Blackhorn Website')
          .items([
            // ── Site Settings (singleton) ──────────────────────────────
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .icon(Settings)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),

            S.divider(),

            // ── About ─────────────────────────────────────────────────
            S.listItem()
              .title('About')
              .icon(Building2)
              .child(
                S.list()
                  .title('About')
                  .items([
                    S.listItem()
                      .title('About Page')
                      .id('aboutPage')
                      .icon(Building2)
                      .child(
                        S.document()
                          .schemaType('aboutPage')
                          .documentId('aboutPage')
                      ),
                    S.listItem()
                      .title('Our Vision')
                      .id('ourVision')
                      .icon(Telescope)
                      .child(
                        S.document()
                          .schemaType('ourVision')
                          .documentId('ourVision')
                      ),
                    S.documentTypeListItem('teamMember')
                      .title('Our Team')
                      .icon(Users),
                    S.documentTypeListItem('award')
                      .title('Our Awards')
                      .icon(Trophy),
                    S.listItem()
                      .title('Our Location')
                      .id('ourLocation')
                      .icon(MapPin)
                      .child(
                        S.document()
                          .schemaType('ourLocation')
                          .documentId('ourLocation')
                      ),
                    S.documentTypeListItem('aboutPillar')
                      .title('About Pillars')
                      .icon(Layers),
                  ])
              ),

            // ── Services ──────────────────────────────────────────────
            S.listItem()
              .title('Services')
              .icon(Briefcase)
              .child(
                S.list()
                  .title('Services')
                  .items([
                    S.documentTypeListItem('service')
                      .title('Service Pages')
                      .icon(Briefcase),
                  ])
              ),

            // ── News & Insights ───────────────────────────────────────
            S.listItem()
              .title('News & Insights')
              .icon(Newspaper)
              .child(
                S.list()
                  .title('News & Insights')
                  .items([
                    S.documentTypeListItem('blogPost')
                      .title('Blog Posts')
                      .icon(Newspaper),
                    S.documentTypeListItem('event')
                      .title('Events')
                      .icon(CalendarDays),
                    S.documentTypeListItem('pressArticle')
                      .title('Press & Coverage')
                      .icon(Mic),
                  ])
              ),

            // ── Careers ───────────────────────────────────────────────
            S.documentTypeListItem('careerPosting')
              .title('Careers')
              .icon(GraduationCap),

            S.divider(),

            // ── Legal ─────────────────────────────────────────────────
            S.documentTypeListItem('legalPage')
              .title('Legal Pages')
              .icon(Scale),
          ]),
    }),
    visionTool(),
  ],

  schema: { types: schemaTypes },
})
