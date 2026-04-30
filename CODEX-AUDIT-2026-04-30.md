# Blackhorn Website Audit

## Security

1. **Severity: High**  
   **File:line:** `src/components/seo/JsonLd.tsx:87-90`, used with CMS titles at `src/app/(site)/[locale]/insights/news/[slug]/page.tsx:157-163`  
   **What's wrong:** `BreadcrumbJsonLd` writes dynamic CMS-derived values into `dangerouslySetInnerHTML` via raw `JSON.stringify`. A malicious title containing `</script>` can break out of the JSON-LD script.  
   **Suggested fix:** Escape `<`, `>`, `&`, U+2028, and U+2029 before injecting JSON-LD, or use a hardened JSON-LD serializer.

2. **Severity: High**  
   **File:line:** `src/app/api/contact/route.ts:37-64`  
   **What's wrong:** Contact form fields are interpolated directly into HTML email without escaping. This allows HTML/script injection in email clients and tracking/image injection into internal inboxes.  
   **Suggested fix:** HTML-escape all user fields before template insertion, or send `text` plus a sanitized HTML version.

3. **Severity: High**  
   **File:line:** `src/app/api/contact/route.ts:18-37`, `src/components/ContactFormAdvanced.tsx:123-132`  
   **What's wrong:** Contact POST has no CSRF/origin validation, rate limiting, honeypot, CAPTCHA, or nonce. Any third-party page can trigger spam email submissions.  
   **Suggested fix:** Require same-origin `Origin`/`Referer`, add rate limiting, add a bot trap or Turnstile/reCAPTCHA, and reject oversized payloads.

4. **Severity: High**  
   **File:line:** `src/app/api/revalidate/route.ts:18-22`, `src/app/api/revalidate/route.ts:28-31`, `src/app/api/revalidate/route.ts:104-106`  
   **What's wrong:** If `SANITY_REVALIDATE_SECRET` is missing, the webhook accepts any POST and can revalidate the whole site.  
   **Suggested fix:** Fail closed when the secret is absent in production and move the secret to an `Authorization` header rather than a query string.

5. **Severity: Medium**  
   **File:line:** `.env.local:1-5`, `.gitignore:38-39`  
   **What's wrong:** `.env.local` is present in the working tree despite `.gitignore` intending to exclude it. No live private key is filled in here, but this pattern risks secret commits later.  
   **Suggested fix:** Remove `.env.local` from Git tracking/history if committed and keep only `.env.example`.

6. **Severity: Medium**  
   **File:line:** `src/lib/sanity/client.ts:10-13`  
   **What's wrong:** `sanityWriteClient` with `SANITY_API_TOKEN` is exported from the general Sanity client module. Accidental import into client code would widen the blast radius.  
   **Suggested fix:** Move write clients to a server-only script/module and add `import 'server-only'`.

**Security notes:** I did not find GROQ string interpolation; slug/category queries use params (`src/lib/sanity/queries.ts:44-61`, `145-153`). I also did not find exposed live API tokens.

## Accessibility

7. **Severity: High**  
   **File:line:** `src/components/ContactFormAdvanced.tsx:406-414`, `src/components/ContactFormAdvanced.tsx:435-441`, `src/components/ContactFormAdvanced.tsx:330-338`  
   **What's wrong:** Labels are not associated with inputs/selects/textareas via `htmlFor`/`id`. Screen readers may not announce fields reliably.  
   **Suggested fix:** Generate stable IDs and wire every label to its control; add `aria-describedby` for errors.

8. **Severity: Medium**  
   **File:line:** `src/components/ContactFormAdvanced.tsx:414`, `src/components/ContactFormAdvanced.tsx:441`, `src/components/ContactFormAdvanced.tsx:354`  
   **What's wrong:** `outline-none` plus subtle border-only focus treatment makes keyboard focus hard to see, especially on gold/white controls.  
   **Suggested fix:** Add clear `focus-visible:ring-2` states with sufficient contrast on all inputs, selects, buttons, and links.

9. **Severity: High**  
   **File:line:** `src/components/layout/Navbar.tsx:213-214`, `src/components/layout/Navbar.tsx:216-223`, `src/components/layout/Navbar.tsx:243-254`  
   **What's wrong:** Desktop dropdowns open on mouse hover only. Keyboard users can focus the top link but cannot reliably open or traverse the submenu.  
   **Suggested fix:** Open dropdowns on focus/click/keyboard, implement Escape/arrow behavior, and keep menus available while focus is inside.

10. **Severity: Medium**  
    **File:line:** `src/components/InvestorGateBottomSheet.tsx:88-90`  
    **What's wrong:** The investor gate is a modal dialog but has no focus trap, no initial focus, and no Escape handling. Background content can remain in the tab order.  
    **Suggested fix:** Use a dialog primitive or implement focus trapping, initial focus, Escape close/decline behavior, and focus restoration.

11. **Severity: Medium**  
    **File:line:** `src/components/layout/Footer.tsx:34-39`, `src/components/layout/Footer.tsx:57-60`, `src/components/InvestorGateBottomSheet.tsx:206-229`  
    **What's wrong:** Footer/legal microcopy uses `text-white/20` and investor links use `text-white/30`; these are below WCAG AA contrast.  
    **Suggested fix:** Raise opacity/color contrast for all legal, license, and privacy text to at least 4.5:1.

12. **Severity: Medium**  
    **File:line:** `src/app/layout.tsx:50`, `src/app/(site)/[locale]/layout.tsx:42-44`  
    **What's wrong:** The root `<html>` is always `lang="en"`; the locale layout sets `lang` on a `<div>`, which does not fix document language for Traditional Chinese pages.  
    **Suggested fix:** Move locale-aware `lang` to `<html>` in the root layout pattern supported by next-intl.

## SEO

13. **Severity: High**  
    **File:line:** `src/app/sitemap.ts:32-39`  
    **What's wrong:** Sitemap emits only unprefixed static URLs and returns before the TODO dynamic Sanity routes. It omits `/zh-hant/*`, news/event/press detail pages, and alternates.  
    **Suggested fix:** Generate localized static and Sanity-driven URLs, include accurate `lastModified`, and add hreflang alternates.

14. **Severity: High**  
    **File:line:** `src/app/layout.tsx:4-42`, representative page metadata at `src/app/(site)/[locale]/contact/page.tsx:13-22`  
    **What's wrong:** No canonical or `alternates.languages` metadata is configured for bilingual routes. Duplicate English/default and `/zh-hant` pages compete without hreflang.  
    **Suggested fix:** Add canonical URLs and `en`/`zh-Hant` language alternates for every route.

15. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/services/investment-advisory/page.tsx:9-12`, `src/app/(site)/[locale]/family-office/page.tsx:3-9`, `src/app/(site)/[locale]/insights/news/page.tsx:12-20`  
    **What's wrong:** Several localized routes use static English metadata, so Traditional Chinese pages can render English titles/descriptions.  
    **Suggested fix:** Convert static metadata to `generateMetadata()` with `getTranslations()`.

16. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/insights/news/[slug]/page.tsx:53-63`, `src/app/(site)/[locale]/insights/events/[slug]/page.tsx:110-118`  
    **What's wrong:** Dynamic article/event metadata uses English CMS fields only and lacks localized `title_zh`/`excerpt_zh`, canonical, Twitter metadata, and article URL.  
    **Suggested fix:** Use `getLocale()` in metadata and localize CMS fields; include canonical, OG URL, and Twitter image data.

## Performance

17. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/layout.tsx:28-30`, `src/components/layout/Footer.tsx:10`, `src/app/(site)/[locale]/page.tsx:13-20`  
    **What's wrong:** `siteSettings` is fetched repeatedly in layout, footer, and pages, creating duplicated Sanity requests per render.  
    **Suggested fix:** Fetch once at the layout level and pass it down, or wrap `fetchSiteSettings()` with React `cache()`.

18. **Severity: Medium**  
    **File:line:** `src/lib/sanity/client.ts:4-7`, `src/lib/sanity/fetch.ts:260-263`  
    **What's wrong:** All reads use `useCdn: false` plus 60-second ISR. This is fresh but slow for mostly static marketing content.  
    **Suggested fix:** Use CDN for public read-heavy content and rely on tag revalidation for publish updates, or split preview/fresh clients from public clients.

19. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/about/page.tsx:52-55`, `src/app/(site)/[locale]/services/wealth-management/page.tsx:98-105`  
    **What's wrong:** Several hero fallbacks use large PNG/JPG assets under `public/images/redesign` up to ~1.8MB. Next optimizes delivery, but source decode/storage cost is still high.  
    **Suggested fix:** Convert hero fallbacks to compressed AVIF/WebP at target dimensions and keep originals outside `public`.

20. **Severity: Low**  
    **File:line:** `src/components/home/Hero.tsx:36-43`  
    **What's wrong:** Homepage hero uses `placeholder="blur"` with a CMS or static source, but no `blurDataURL` is supplied. This can fail or silently lose the intended blur behavior depending on source.  
    **Suggested fix:** Provide a blur data URL for static assets and omit blur placeholders for arbitrary Sanity URLs unless generated.

## Code Quality

21. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/awards/page.tsx:27-108`, `src/components/home/Awards.tsx:7-29`, `src/app/(site)/[locale]/insights/press/page.tsx:19-84`  
    **What's wrong:** Hardcoded fallback awards/press content duplicates CMS content and has drift risk. Example: homepage awards differ from awards page ordering/titles.  
    **Suggested fix:** Move fallback content to one shared typed source, or require CMS seed data and remove page-local fallbacks.

22. **Severity: Medium**  
    **File:line:** `src/components/home/Insights.tsx:6-22`  
    **What's wrong:** Homepage insights are hardcoded and not wired to Sanity, unlike news/events/press listing pages. Content will go stale.  
    **Suggested fix:** Fetch recent posts/events/press from Sanity with a shared “latest insights” model.

23. **Severity: Low**  
    **File:line:** `src/components/ContactForm.tsx:22`, `src/components/DisclaimerBanner.tsx:11`, `src/components/InvestorDisclaimerModal.tsx:11`  
    **What's wrong:** These components appear unused; the active contact page uses `ContactFormAdvanced`, and the layout uses `InvestorGateBottomSheet`.  
    **Suggested fix:** Delete unused components or document why they are retained.

24. **Severity: Low**  
    **File:line:** `src/lib/sanity/image.ts:27-28`, `src/app/(site)/[locale]/insights/news/[slug]/page.tsx:69-70`, `src/app/(site)/[locale]/insights/events/[slug]/page.tsx:30-31`  
    **What's wrong:** `any` is used around Sanity image rendering. This hides schema mismatches such as missing alt/caption fields.  
    **Suggested fix:** Define a shared `SanityImageWithAlt` type and use it in Portable Text renderers.

## Mobile Responsiveness

25. **Severity: Medium**  
    **File:line:** `src/components/home/TrustBar.tsx:63`, `src/components/home/WhatWeOffer.tsx:70`, `src/components/home/About.tsx:10`, `src/components/home/Awards.tsx:47`  
    **What's wrong:** Several homepage sections use `px-12` without smaller mobile defaults, causing cramped 375px layouts.  
    **Suggested fix:** Use `px-6 md:px-12` consistently.

26. **Severity: Low**  
    **File:line:** `src/components/InvestorGateBottomSheet.tsx:190-200`  
    **What's wrong:** Investor gate action buttons use wide fixed horizontal padding inside a bottom sheet. Long Traditional Chinese labels may wrap awkwardly on small screens.  
    **Suggested fix:** Use full-width mobile buttons with responsive padding and `min-h` rather than fixed visual width.

## Bilingual / next-intl

27. **Severity: Medium**  
    **File:line:** `src/components/services/ServicePageLayout.tsx:72-76`, `src/components/services/ServicePageLayout.tsx:96-111`, `src/components/services/ServicePageLayout.tsx:220-253`  
    **What's wrong:** Shared service layout hardcodes “Home”, “Services”, “Other Services”, “Ready to get started?”, and “Contact Us”. These will appear in English on Chinese pages.  
    **Suggested fix:** Pass translated labels into the layout or call `useTranslations`/server translations at the page boundary.

28. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/services/investment-advisory/page.tsx:47-49`, `src/app/(site)/[locale]/services/investment-advisory/page.tsx:63-115`  
    **What's wrong:** Deal Sourcing fallback title/subtitle/body are hardcoded English. If CMS content is missing, Chinese pages fall back to English.  
    **Suggested fix:** Use `servicesHub` translation keys for all fallback copy.

**Bilingual note:** `src/messages/en.json` and `src/messages/zh-hant.json` have matching key sets; I found 0 missing keys in either file.

## Sanity CMS

29. **Severity: Medium**  
    **File:line:** `src/sanity/schemas/service.ts:42-58`, `src/sanity/schemas/service.ts:210-228`, `src/components/services/ServicePortableText.tsx:3-18`  
    **What's wrong:** Service Portable Text schema allows images, but the renderer does not handle image blocks; image content may disappear. The service image blocks also lack `alt`.  
    **Suggested fix:** Add a typed image renderer and add required/recommended alt fields to service image blocks.

30. **Severity: Medium**  
    **File:line:** `src/lib/sanity/queries.ts:68-75`, `src/lib/sanity/queries.ts:160-165`, `src/lib/sanity/queries.ts:191-207`  
    **What's wrong:** Several image projections fetch only asset URLs and omit alt/caption metadata. Listing cards then fall back to titles or empty alt text.  
    **Suggested fix:** Project image `alt`, `caption`, dimensions, and LQIP where needed.

31. **Severity: Low**  
    **File:line:** `src/lib/sanity/queries.ts:219-220`, `src/sanity/schemas/siteSettings.ts:3-6`  
    **What's wrong:** `siteSettings` is treated as a singleton with `[0]`, but the schema is a normal document type. Multiple documents can produce arbitrary settings.  
    **Suggested fix:** Enforce a fixed `_id` singleton in desk structure and queries, or filter by `_id == "siteSettings"`.

## Domain-Specific / Regulatory

32. **Severity: High**  
    **File:line:** `src/messages/en.json:667`, compare `src/lib/constants.ts:7` and `src/messages/en.json:74`  
    **What's wrong:** Investor gate says Blackhorn is licensed for Type 1, Type 4, and Type 9, while the rest of the site says Type 4 and Type 9 only. This is a material regulatory inconsistency.  
    **Suggested fix:** Confirm with compliance and make the SFC activity types consistent across all messages, CMS defaults, footer, and disclaimers.

33. **Severity: High**  
    **File:line:** `src/messages/en.json:584`, `src/messages/zh-hant.json:584`  
    **What's wrong:** Privacy policy includes placeholder text saying the full policy will be published after legal review. That is not appropriate for a production UHNW lead-generation form collecting personal data.  
    **Suggested fix:** Replace with a finalized PDPO-compliant privacy notice before production promotion.

34. **Severity: Medium**  
    **File:line:** `src/components/ContactFormAdvanced.tsx:359-374`  
    **What's wrong:** Contact form links to terms/privacy but does not clearly state collection purpose, retention, voluntary/mandatory fields, transfer recipients, or data access/correction rights.  
    **Suggested fix:** Add concise PDPO collection notice near submit and link to the full privacy policy.

35. **Severity: Medium**  
    **File:line:** `src/components/layout/LayoutShell.tsx:13-17`, `src/components/DisclaimerBanner.tsx:11-67`  
    **What's wrong:** Fraud warning banner component exists but is not mounted. If a user accepted the investor gate, persistent fraud notice visibility is reduced.  
    **Suggested fix:** Mount the banner or consolidate fraud warning into a visible site-wide component with localized links.

36. **Severity: Low**  
    **File:line:** `src/components/layout/Footer.tsx:34-39`, `src/lib/constants.ts:7`, `src/messages/zh-hant.json:74-75`  
    **What's wrong:** Footer SFC license text comes from English `SITE_CONFIG.license`, while localized `sfcBadge` exists but is unused. Chinese pages still show English license wording.  
    **Suggested fix:** Render localized license text from translations or CMS.

## Top 5 Priorities

1. Fix the regulatory license inconsistency: Type 1 vs Type 4/9.  
2. Harden contact and revalidation APIs: CSRF/origin checks, rate limiting, mandatory webhook secret, escaped email HTML.  
3. Escape JSON-LD script content before `dangerouslySetInnerHTML`.  
4. Replace placeholder privacy policy and add a PDPO collection notice to the contact form.  
5. Add localized canonicals/hreflang and rebuild the sitemap with `/zh-hant` plus Sanity detail routes.
2026-04-30T03:37:17.496938Z ERROR codex_core::session: failed to record rollout items: thread 019ddc72-82bd-74b3-a8af-656ec99fda9c not found
tokens used
164,183
# Blackhorn Website Audit

## Security

1. **Severity: High**  
   **File:line:** `src/components/seo/JsonLd.tsx:87-90`, used with CMS titles at `src/app/(site)/[locale]/insights/news/[slug]/page.tsx:157-163`  
   **What's wrong:** `BreadcrumbJsonLd` writes dynamic CMS-derived values into `dangerouslySetInnerHTML` via raw `JSON.stringify`. A malicious title containing `</script>` can break out of the JSON-LD script.  
   **Suggested fix:** Escape `<`, `>`, `&`, U+2028, and U+2029 before injecting JSON-LD, or use a hardened JSON-LD serializer.

2. **Severity: High**  
   **File:line:** `src/app/api/contact/route.ts:37-64`  
   **What's wrong:** Contact form fields are interpolated directly into HTML email without escaping. This allows HTML/script injection in email clients and tracking/image injection into internal inboxes.  
   **Suggested fix:** HTML-escape all user fields before template insertion, or send `text` plus a sanitized HTML version.

3. **Severity: High**  
   **File:line:** `src/app/api/contact/route.ts:18-37`, `src/components/ContactFormAdvanced.tsx:123-132`  
   **What's wrong:** Contact POST has no CSRF/origin validation, rate limiting, honeypot, CAPTCHA, or nonce. Any third-party page can trigger spam email submissions.  
   **Suggested fix:** Require same-origin `Origin`/`Referer`, add rate limiting, add a bot trap or Turnstile/reCAPTCHA, and reject oversized payloads.

4. **Severity: High**  
   **File:line:** `src/app/api/revalidate/route.ts:18-22`, `src/app/api/revalidate/route.ts:28-31`, `src/app/api/revalidate/route.ts:104-106`  
   **What's wrong:** If `SANITY_REVALIDATE_SECRET` is missing, the webhook accepts any POST and can revalidate the whole site.  
   **Suggested fix:** Fail closed when the secret is absent in production and move the secret to an `Authorization` header rather than a query string.

5. **Severity: Medium**  
   **File:line:** `.env.local:1-5`, `.gitignore:38-39`  
   **What's wrong:** `.env.local` is present in the working tree despite `.gitignore` intending to exclude it. No live private key is filled in here, but this pattern risks secret commits later.  
   **Suggested fix:** Remove `.env.local` from Git tracking/history if committed and keep only `.env.example`.

6. **Severity: Medium**  
   **File:line:** `src/lib/sanity/client.ts:10-13`  
   **What's wrong:** `sanityWriteClient` with `SANITY_API_TOKEN` is exported from the general Sanity client module. Accidental import into client code would widen the blast radius.  
   **Suggested fix:** Move write clients to a server-only script/module and add `import 'server-only'`.

**Security notes:** I did not find GROQ string interpolation; slug/category queries use params (`src/lib/sanity/queries.ts:44-61`, `145-153`). I also did not find exposed live API tokens.

## Accessibility

7. **Severity: High**  
   **File:line:** `src/components/ContactFormAdvanced.tsx:406-414`, `src/components/ContactFormAdvanced.tsx:435-441`, `src/components/ContactFormAdvanced.tsx:330-338`  
   **What's wrong:** Labels are not associated with inputs/selects/textareas via `htmlFor`/`id`. Screen readers may not announce fields reliably.  
   **Suggested fix:** Generate stable IDs and wire every label to its control; add `aria-describedby` for errors.

8. **Severity: Medium**  
   **File:line:** `src/components/ContactFormAdvanced.tsx:414`, `src/components/ContactFormAdvanced.tsx:441`, `src/components/ContactFormAdvanced.tsx:354`  
   **What's wrong:** `outline-none` plus subtle border-only focus treatment makes keyboard focus hard to see, especially on gold/white controls.  
   **Suggested fix:** Add clear `focus-visible:ring-2` states with sufficient contrast on all inputs, selects, buttons, and links.

9. **Severity: High**  
   **File:line:** `src/components/layout/Navbar.tsx:213-214`, `src/components/layout/Navbar.tsx:216-223`, `src/components/layout/Navbar.tsx:243-254`  
   **What's wrong:** Desktop dropdowns open on mouse hover only. Keyboard users can focus the top link but cannot reliably open or traverse the submenu.  
   **Suggested fix:** Open dropdowns on focus/click/keyboard, implement Escape/arrow behavior, and keep menus available while focus is inside.

10. **Severity: Medium**  
    **File:line:** `src/components/InvestorGateBottomSheet.tsx:88-90`  
    **What's wrong:** The investor gate is a modal dialog but has no focus trap, no initial focus, and no Escape handling. Background content can remain in the tab order.  
    **Suggested fix:** Use a dialog primitive or implement focus trapping, initial focus, Escape close/decline behavior, and focus restoration.

11. **Severity: Medium**  
    **File:line:** `src/components/layout/Footer.tsx:34-39`, `src/components/layout/Footer.tsx:57-60`, `src/components/InvestorGateBottomSheet.tsx:206-229`  
    **What's wrong:** Footer/legal microcopy uses `text-white/20` and investor links use `text-white/30`; these are below WCAG AA contrast.  
    **Suggested fix:** Raise opacity/color contrast for all legal, license, and privacy text to at least 4.5:1.

12. **Severity: Medium**  
    **File:line:** `src/app/layout.tsx:50`, `src/app/(site)/[locale]/layout.tsx:42-44`  
    **What's wrong:** The root `<html>` is always `lang="en"`; the locale layout sets `lang` on a `<div>`, which does not fix document language for Traditional Chinese pages.  
    **Suggested fix:** Move locale-aware `lang` to `<html>` in the root layout pattern supported by next-intl.

## SEO

13. **Severity: High**  
    **File:line:** `src/app/sitemap.ts:32-39`  
    **What's wrong:** Sitemap emits only unprefixed static URLs and returns before the TODO dynamic Sanity routes. It omits `/zh-hant/*`, news/event/press detail pages, and alternates.  
    **Suggested fix:** Generate localized static and Sanity-driven URLs, include accurate `lastModified`, and add hreflang alternates.

14. **Severity: High**  
    **File:line:** `src/app/layout.tsx:4-42`, representative page metadata at `src/app/(site)/[locale]/contact/page.tsx:13-22`  
    **What's wrong:** No canonical or `alternates.languages` metadata is configured for bilingual routes. Duplicate English/default and `/zh-hant` pages compete without hreflang.  
    **Suggested fix:** Add canonical URLs and `en`/`zh-Hant` language alternates for every route.

15. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/services/investment-advisory/page.tsx:9-12`, `src/app/(site)/[locale]/family-office/page.tsx:3-9`, `src/app/(site)/[locale]/insights/news/page.tsx:12-20`  
    **What's wrong:** Several localized routes use static English metadata, so Traditional Chinese pages can render English titles/descriptions.  
    **Suggested fix:** Convert static metadata to `generateMetadata()` with `getTranslations()`.

16. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/insights/news/[slug]/page.tsx:53-63`, `src/app/(site)/[locale]/insights/events/[slug]/page.tsx:110-118`  
    **What's wrong:** Dynamic article/event metadata uses English CMS fields only and lacks localized `title_zh`/`excerpt_zh`, canonical, Twitter metadata, and article URL.  
    **Suggested fix:** Use `getLocale()` in metadata and localize CMS fields; include canonical, OG URL, and Twitter image data.

## Performance

17. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/layout.tsx:28-30`, `src/components/layout/Footer.tsx:10`, `src/app/(site)/[locale]/page.tsx:13-20`  
    **What's wrong:** `siteSettings` is fetched repeatedly in layout, footer, and pages, creating duplicated Sanity requests per render.  
    **Suggested fix:** Fetch once at the layout level and pass it down, or wrap `fetchSiteSettings()` with React `cache()`.

18. **Severity: Medium**  
    **File:line:** `src/lib/sanity/client.ts:4-7`, `src/lib/sanity/fetch.ts:260-263`  
    **What's wrong:** All reads use `useCdn: false` plus 60-second ISR. This is fresh but slow for mostly static marketing content.  
    **Suggested fix:** Use CDN for public read-heavy content and rely on tag revalidation for publish updates, or split preview/fresh clients from public clients.

19. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/about/page.tsx:52-55`, `src/app/(site)/[locale]/services/wealth-management/page.tsx:98-105`  
    **What's wrong:** Several hero fallbacks use large PNG/JPG assets under `public/images/redesign` up to ~1.8MB. Next optimizes delivery, but source decode/storage cost is still high.  
    **Suggested fix:** Convert hero fallbacks to compressed AVIF/WebP at target dimensions and keep originals outside `public`.

20. **Severity: Low**  
    **File:line:** `src/components/home/Hero.tsx:36-43`  
    **What's wrong:** Homepage hero uses `placeholder="blur"` with a CMS or static source, but no `blurDataURL` is supplied. This can fail or silently lose the intended blur behavior depending on source.  
    **Suggested fix:** Provide a blur data URL for static assets and omit blur placeholders for arbitrary Sanity URLs unless generated.

## Code Quality

21. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/awards/page.tsx:27-108`, `src/components/home/Awards.tsx:7-29`, `src/app/(site)/[locale]/insights/press/page.tsx:19-84`  
    **What's wrong:** Hardcoded fallback awards/press content duplicates CMS content and has drift risk. Example: homepage awards differ from awards page ordering/titles.  
    **Suggested fix:** Move fallback content to one shared typed source, or require CMS seed data and remove page-local fallbacks.

22. **Severity: Medium**  
    **File:line:** `src/components/home/Insights.tsx:6-22`  
    **What's wrong:** Homepage insights are hardcoded and not wired to Sanity, unlike news/events/press listing pages. Content will go stale.  
    **Suggested fix:** Fetch recent posts/events/press from Sanity with a shared “latest insights” model.

23. **Severity: Low**  
    **File:line:** `src/components/ContactForm.tsx:22`, `src/components/DisclaimerBanner.tsx:11`, `src/components/InvestorDisclaimerModal.tsx:11`  
    **What's wrong:** These components appear unused; the active contact page uses `ContactFormAdvanced`, and the layout uses `InvestorGateBottomSheet`.  
    **Suggested fix:** Delete unused components or document why they are retained.

24. **Severity: Low**  
    **File:line:** `src/lib/sanity/image.ts:27-28`, `src/app/(site)/[locale]/insights/news/[slug]/page.tsx:69-70`, `src/app/(site)/[locale]/insights/events/[slug]/page.tsx:30-31`  
    **What's wrong:** `any` is used around Sanity image rendering. This hides schema mismatches such as missing alt/caption fields.  
    **Suggested fix:** Define a shared `SanityImageWithAlt` type and use it in Portable Text renderers.

## Mobile Responsiveness

25. **Severity: Medium**  
    **File:line:** `src/components/home/TrustBar.tsx:63`, `src/components/home/WhatWeOffer.tsx:70`, `src/components/home/About.tsx:10`, `src/components/home/Awards.tsx:47`  
    **What's wrong:** Several homepage sections use `px-12` without smaller mobile defaults, causing cramped 375px layouts.  
    **Suggested fix:** Use `px-6 md:px-12` consistently.

26. **Severity: Low**  
    **File:line:** `src/components/InvestorGateBottomSheet.tsx:190-200`  
    **What's wrong:** Investor gate action buttons use wide fixed horizontal padding inside a bottom sheet. Long Traditional Chinese labels may wrap awkwardly on small screens.  
    **Suggested fix:** Use full-width mobile buttons with responsive padding and `min-h` rather than fixed visual width.

## Bilingual / next-intl

27. **Severity: Medium**  
    **File:line:** `src/components/services/ServicePageLayout.tsx:72-76`, `src/components/services/ServicePageLayout.tsx:96-111`, `src/components/services/ServicePageLayout.tsx:220-253`  
    **What's wrong:** Shared service layout hardcodes “Home”, “Services”, “Other Services”, “Ready to get started?”, and “Contact Us”. These will appear in English on Chinese pages.  
    **Suggested fix:** Pass translated labels into the layout or call `useTranslations`/server translations at the page boundary.

28. **Severity: Medium**  
    **File:line:** `src/app/(site)/[locale]/services/investment-advisory/page.tsx:47-49`, `src/app/(site)/[locale]/services/investment-advisory/page.tsx:63-115`  
    **What's wrong:** Deal Sourcing fallback title/subtitle/body are hardcoded English. If CMS content is missing, Chinese pages fall back to English.  
    **Suggested fix:** Use `servicesHub` translation keys for all fallback copy.

**Bilingual note:** `src/messages/en.json` and `src/messages/zh-hant.json` have matching key sets; I found 0 missing keys in either file.

## Sanity CMS

29. **Severity: Medium**  
    **File:line:** `src/sanity/schemas/service.ts:42-58`, `src/sanity/schemas/service.ts:210-228`, `src/components/services/ServicePortableText.tsx:3-18`  
    **What's wrong:** Service Portable Text schema allows images, but the renderer does not handle image blocks; image content may disappear. The service image blocks also lack `alt`.  
    **Suggested fix:** Add a typed image renderer and add required/recommended alt fields to service image blocks.

30. **Severity: Medium**  
    **File:line:** `src/lib/sanity/queries.ts:68-75`, `src/lib/sanity/queries.ts:160-165`, `src/lib/sanity/queries.ts:191-207`  
    **What's wrong:** Several image projections fetch only asset URLs and omit alt/caption metadata. Listing cards then fall back to titles or empty alt text.  
    **Suggested fix:** Project image `alt`, `caption`, dimensions, and LQIP where needed.

31. **Severity: Low**  
    **File:line:** `src/lib/sanity/queries.ts:219-220`, `src/sanity/schemas/siteSettings.ts:3-6`  
    **What's wrong:** `siteSettings` is treated as a singleton with `[0]`, but the schema is a normal document type. Multiple documents can produce arbitrary settings.  
    **Suggested fix:** Enforce a fixed `_id` singleton in desk structure and queries, or filter by `_id == "siteSettings"`.

## Domain-Specific / Regulatory

32. **Severity: High**  
    **File:line:** `src/messages/en.json:667`, compare `src/lib/constants.ts:7` and `src/messages/en.json:74`  
    **What's wrong:** Investor gate says Blackhorn is licensed for Type 1, Type 4, and Type 9, while the rest of the site says Type 4 and Type 9 only. This is a material regulatory inconsistency.  
    **Suggested fix:** Confirm with compliance and make the SFC activity types consistent across all messages, CMS defaults, footer, and disclaimers.

33. **Severity: High**  
    **File:line:** `src/messages/en.json:584`, `src/messages/zh-hant.json:584`  
    **What's wrong:** Privacy policy includes placeholder text saying the full policy will be published after legal review. That is not appropriate for a production UHNW lead-generation form collecting personal data.  
    **Suggested fix:** Replace with a finalized PDPO-compliant privacy notice before production promotion.

34. **Severity: Medium**  
    **File:line:** `src/components/ContactFormAdvanced.tsx:359-374`  
    **What's wrong:** Contact form links to terms/privacy but does not clearly state collection purpose, retention, voluntary/mandatory fields, transfer recipients, or data access/correction rights.  
    **Suggested fix:** Add concise PDPO collection notice near submit and link to the full privacy policy.

35. **Severity: Medium**  
    **File:line:** `src/components/layout/LayoutShell.tsx:13-17`, `src/components/DisclaimerBanner.tsx:11-67`  
    **What's wrong:** Fraud warning banner component exists but is not mounted. If a user accepted the investor gate, persistent fraud notice visibility is reduced.  
    **Suggested fix:** Mount the banner or consolidate fraud warning into a visible site-wide component with localized links.

36. **Severity: Low**  
    **File:line:** `src/components/layout/Footer.tsx:34-39`, `src/lib/constants.ts:7`, `src/messages/zh-hant.json:74-75`  
    **What's wrong:** Footer SFC license text comes from English `SITE_CONFIG.license`, while localized `sfcBadge` exists but is unused. Chinese pages still show English license wording.  
    **Suggested fix:** Render localized license text from translations or CMS.

## Top 5 Priorities

1. Fix the regulatory license inconsistency: Type 1 vs Type 4/9.  
2. Harden contact and revalidation APIs: CSRF/origin checks, rate limiting, mandatory webhook secret, escaped email HTML.  
3. Escape JSON-LD script content before `dangerouslySetInnerHTML`.  
4. Replace placeholder privacy policy and add a PDPO collection notice to the contact form.  
5. Add localized canonicals/hreflang and rebuild the sitemap with `/zh-hant` plus Sanity detail routes.
