import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "University of Nigeria, Nsukka - Official Website",
    template: "%s | University of Nigeria, Nsukka"
  },
  description: "Nigeria's first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Offering world-class education across 17 faculties with over 300 academic programs.",
  keywords: [
    "University of Nigeria Nsukka",
    "UNN",
    "Nigeria university",
    "higher education",
    "academic programs",
    "student portal",
    "hostel management",
    "accommodation",
    "undergraduate",
    "postgraduate",
    "research",
    "academic excellence"
  ],
  authors: [{ name: "University of Nigeria, Nsukka" }],
  creator: "University of Nigeria, Nsukka",
  publisher: "University of Nigeria, Nsukka",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://unnaccomodation.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://unnaccomodation.com',
    siteName: 'University of Nigeria, Nsukka',
    title: 'University of Nigeria, Nsukka - Official Website',
    description: 'Nigeria\'s first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Offering world-class education across 17 faculties with over 300 academic programs.',
    images: [
      {
        url: '/unn.png',
        width: 120,
        height: 120,
        alt: 'UNN Logo',
      },
      {
        url: '/images/kuti-hall.jpg',
        width: 1200,
        height: 630,
        alt: 'University of Nigeria, Nsukka Campus',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'University of Nigeria, Nsukka - Official Website',
    description: 'Nigeria\'s first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Offering world-class education across 17 faculties with over 300 academic programs.',
    images: ['/images/kuti-hall.jpg'],
    creator: '@UNN_Official',
    site: '@UNN_Official',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Replace with actual verification code
    yandex: 'your-yandex-verification-code', // Replace with actual verification code
    yahoo: 'your-yahoo-verification-code', // Replace with actual verification code
  },
  category: 'education',
  classification: 'university',
  other: {
    'msapplication-TileColor': '#1f2937',
    'theme-color': '#1f2937',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//api.unnaccomodation.com" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "University of Nigeria, Nsukka",
              "alternateName": "UNN",
              "url": "https://unnaccomodation.com",
              "logo": "https://unnaccomodation.com/unn.png",
              "description": "Nigeria's first autonomous university, founded in 1955 by Dr. Nnamdi Azikiwe. Offering world-class education across 17 faculties with over 300 academic programs.",
              "foundingDate": "1955",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Nsukka",
                "addressRegion": "Enugu State",
                "addressCountry": "Nigeria"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "info@unn.edu.ng"
              },
              "sameAs": [
                "https://www.unn.edu.ng",
                "https://en.wikipedia.org/wiki/University_of_Nigeria"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
