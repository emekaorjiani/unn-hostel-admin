import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  keywords?: string[]
  ogType?: 'website' | 'article' | 'profile' | 'product'
  ogImage?: string
  ogImageAlt?: string
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
  structuredData?: object
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  ogType = 'website',
  ogImage = '/images/kuti-hall.jpg',
  ogImageAlt = 'University of Nigeria, Nsukka',
  canonicalUrl,
  noIndex = false,
  noFollow = false,
  structuredData
}: SEOHeadProps) {
  const fullTitle = title.includes('University of Nigeria') 
    ? title 
    : `${title} | University of Nigeria, Nsukka`
  
  const fullDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description

  const baseUrl = 'https://unnaccomodation.com'
  const currentUrl = canonicalUrl || `${baseUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`

  return (
    <Head>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={fullDescription} />
      {keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noIndex || noFollow ? (
        <meta name="robots" content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`} />
      ) : (
        <meta name="robots" content="index, follow" />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:site_name" content="University of Nigeria, Nsukka" />
      <meta property="og:locale" content="en_US" />
      <meta property="og:image" content={`${baseUrl}${ogImage}`} />
      <meta property="og:image:alt" content={ogImageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={fullDescription} />
      <meta name="twitter:image" content={`${baseUrl}${ogImage}`} />
      <meta name="twitter:site" content="@UNN_Official" />
      <meta name="twitter:creator" content="@UNN_Official" />
      
      {/* Additional Meta Tags */}
      <meta name="author" content="University of Nigeria, Nsukka" />
      <meta name="publisher" content="University of Nigeria, Nsukka" />
      <meta name="category" content="education" />
      <meta name="classification" content="university" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Preconnect for Performance */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="//api.unnaccomodation.com" />
    </Head>
  )
}
