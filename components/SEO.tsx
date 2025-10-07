import Head from 'next/head'

interface SEOProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string
}

export default function SEO({
  title,
  description,
  canonical,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  keywords = 'automatización financiera, ERP, contabilidad, IA, fintech'
}: SEOProps) {
  const siteName = 'Flow - Automatización Financiera'
  const fullTitle = `${title} | ${siteName}`
  const siteUrl = 'https://flow.pe' // Cambiar por tu dominio real

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={`${siteUrl}${canonical}`} />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:url" content={`${siteUrl}${canonical || ''}`} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />
      
      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="Spanish" />
      <meta name="author" content="Flow" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'Flow',
            description: 'Plataforma de automatización financiera con IA',
            url: siteUrl,
            logo: `${siteUrl}/images/logo/flow-logo.jpg`,
            sameAs: [
              'https://linkedin.com/company/flow',
              'https://twitter.com/flow'
            ]
          })
        }}
      />
    </Head>
  )
}
