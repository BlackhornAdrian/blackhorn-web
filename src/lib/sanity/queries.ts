import { groq } from 'next-sanity'

// ---------------------------------------------------------------------------
// Team Members
// ---------------------------------------------------------------------------

export const teamMembersQuery = groq`
  *[_type == "teamMember"] | order(order asc) {
    _id, name, name_zh, slug, role, role_zh, category,
    bio, bio_zh, order, isInvestmentCommittee,
    "photoUrl": photo.asset->url
  }
`

export const managementTeamQuery = groq`
  *[_type == "teamMember" && category == "management"] | order(order asc) {
    _id, name, name_zh, slug, role, role_zh,
    bio, bio_zh, isInvestmentCommittee,
    "photoUrl": photo.asset->url
  }
`

export const advisoryBoardQuery = groq`
  *[_type == "teamMember" && category == "advisory"] | order(order asc) {
    _id, name, name_zh, slug, role, role_zh,
    bio, bio_zh,
    "photoUrl": photo.asset->url
  }
`

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

export const servicesQuery = groq`
  *[_type == "service"] | order(order asc) {
    _id, title, title_zh, slug,
    shortDescription, shortDescription_zh,
    icon, content, content_zh,
    features, features_zh, order
  }
`

export const serviceBySlugQuery = groq`
  *[_type == "service" && slug.current == $slug][0] {
    _id, title, title_zh, slug,
    shortDescription, shortDescription_zh,
    icon, content, content_zh,
    features, features_zh,
    advisoryTeamName, advisoryTeamBio,
    bodyFontSize,
    infographicLabel, infographicLabel_zh,
    infographicAlt, infographicSize,
    "infographicUrl": infographicImage.asset->url,
    ecosystemPartnersLabel, ecosystemPartnersLabel_zh,
    "ecosystemPartners": ecosystemPartners[] {
      name,
      url,
      "logoUrl": logo.asset->url
    }
  }
`

// ---------------------------------------------------------------------------
// Press
// ---------------------------------------------------------------------------

export const pressArticlesQuery = groq`
  *[_type == "pressArticle"] | order(publishDate desc) {
    _id, title, title_zh, slug, publication, author,
    publishDate, summary, summary_zh,
    externalUrl, language, titleChinese,
    "heroImageUrl": heroImage.asset->url,
    "thumbnailUrl": thumbnailImage.asset->url
  }
`

export const pressArticleBySlugQuery = groq`
  *[_type == "pressArticle" && slug.current == $slug][0] {
    _id, title, title_zh, slug, publication, author,
    publishDate, summary, summary_zh,
    externalUrl, language, titleChinese,
    "heroImageUrl": heroImage.asset->url,
    "thumbnailUrl": thumbnailImage.asset->url
  }
`

// ---------------------------------------------------------------------------
// Blog Posts
// ---------------------------------------------------------------------------

export const blogPostsQuery = groq`
  *[_type == "blogPost" && status == "published"] | order(publishDate desc) {
    _id, title, title_zh,
    slug,
    publishDate,
    author->{ name, name_zh, "photoUrl": image.asset->url },
    category,
    tags,
    excerpt, excerpt_zh,
    "coverImageUrl": coverImage.asset->url,
    featured
  }
`

export const blogPostBySlugQuery = groq`
  *[_type == "blogPost" && slug.current == $slug && status == "published"][0] {
    _id, title, title_zh,
    slug,
    publishDate,
    author->{ name, name_zh, role, role_zh, "photoUrl": image.asset->url },
    category,
    tags,
    excerpt, excerpt_zh,
    "coverImageUrl": coverImage.asset->url,
    "coverImageAlt": coverImage.alt,
    body, body_zh,
    featured
  }
`

export const featuredBlogPostsQuery = groq`
  *[_type == "blogPost" && status == "published" && featured == true] | order(publishDate desc)[0...3] {
    _id, title, title_zh,
    slug,
    publishDate,
    excerpt, excerpt_zh,
    "coverImageUrl": coverImage.asset->url,
    category
  }
`

export const recentBlogPostsQuery = groq`
  *[_type == "blogPost" && status == "published"] | order(publishDate desc)[0...3] {
    _id, title, title_zh,
    slug,
    publishDate,
    excerpt, excerpt_zh,
    "coverImageUrl": coverImage.asset->url,
    category,
    author->{ name, name_zh }
  }
`

export const relatedBlogPostsQuery = groq`
  *[_type == "blogPost" && status == "published" && category == $category && slug.current != $currentSlug] | order(publishDate desc)[0...3] {
    _id, title, title_zh,
    slug,
    publishDate,
    excerpt, excerpt_zh,
    "coverImageUrl": coverImage.asset->url,
    category
  }
`

// ---------------------------------------------------------------------------
// Awards
// ---------------------------------------------------------------------------

export const awardsQuery = groq`
  *[_type == "award"] | order(year desc, title asc) {
    _id, title, title_zh, organization, organization_zh, year, category,
    description, description_zh,
    "imageUrl": image.asset->url
  }
`

// ---------------------------------------------------------------------------
// About Pillars
// ---------------------------------------------------------------------------

export const aboutPillarsQuery = groq`
  *[_type == "aboutPillar"] | order(order asc) {
    _id, title, title_zh, description, description_zh, href, slug, order
  }
`

export const aboutPillarBySlugQuery = groq`
  *[_type == "aboutPillar" && slug.current == $slug][0] {
    _id, title, title_zh, description, description_zh,
    subtitle, subtitle_zh,
    content, content_zh,
    href, slug, order
  }
`

// ---------------------------------------------------------------------------
// Events
// ---------------------------------------------------------------------------

export const eventsQuery = groq`
  *[_type == "event"] | order(date desc) {
    _id, title, title_zh, slug, date, location,
    "heroImageUrl": heroImage.asset->url
  }
`

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, title_zh, slug, date, location,
    description, description_zh,
    ctaText, ctaText_zh, ctaEmail,
    "heroImageUrl": heroImage.asset->url,
    gallery[] {
      caption,
      "url": asset->url
    },
    speakers[] {
      name, title,
      "photoUrl": photo.asset->url
    }
  }
`

// ---------------------------------------------------------------------------
// Site Settings (singleton)
// ---------------------------------------------------------------------------

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    companyName, companyName_zh,
    phone, email, careersEmail,
    complianceEmail, compliancePhone,
    address, address_zh, sfcLicense, sfcTypes,
    showCtfsSubsidiary, linkedinUrl,
    heroHeading, heroHeading_zh,
    heroSubtext, heroSubtext_zh,
    missionStatement, missionStatement_zh,
    trustBarStats,
    disclaimerText, disclaimerText_zh,
    fraudNoticeText, fraudNoticeText_zh,
    careersMessage, careersMessage_zh,
    whatWeOfferCards[] {
      key, title, title_zh, description, description_zh
    },
    investorGateEnabled,
    investorGateTitle, investorGateTitle_zh,
    investorGateBody, investorGateBody_zh,
    investorGateRegulatory, investorGateRegulatory_zh,
    investorGateScamAlert, investorGateScamAlert_zh,
    heroImages[] {
      pageKey,
      alt,
      heading, heading_zh,
      subtext, subtext_zh,
      "imageUrl": image.asset->url
    }
  }
`

// ---------------------------------------------------------------------------
// Our Location
// ---------------------------------------------------------------------------

export const ourLocationQuery = groq`
  *[_type == "ourLocation"][0] {
    companyName, companyName_zh,
    phone, email,
    address, address_zh,
  }
`

// ---------------------------------------------------------------------------
// Career Postings
// ---------------------------------------------------------------------------

export const careerPostingsQuery = groq`
  *[_type == "careerPosting" && status == "open"] | order(publishDate desc) {
    _id, title, title_zh, slug, department, employmentType,
    location, contactEmail, publishDate, closingDate, status
  }
`

export const careerPostingBySlugQuery = groq`
  *[_type == "careerPosting" && slug.current == $slug && status == "open"][0] {
    _id, title, title_zh, slug, department, employmentType,
    location, description, description_zh,
    requirements, requirements_zh,
    benefits, benefits_zh,
    contactEmail, publishDate, closingDate, status
  }
`

// ---------------------------------------------------------------------------
// Legal Pages
// ---------------------------------------------------------------------------

export const legalPageBySlugQuery = groq`
  *[_type == "legalPage" && slug.current == $slug][0] {
    _id, title, title_zh, slug,
    content, content_zh, lastUpdated
  }
`
