import type { Metadata, Viewport } from 'next';
import './globals.css';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SiteScripts from '@/components/SiteScripts';
import { brand } from '@/lib/brand';

// ==========================================
// WEBSITE SEO CONFIGURATION
// ==========================================

const siteName = brand.name;
const siteUrl = brand.siteUrl.replace(/\/$/, '');
const siteDescription = brand.description;

const defaultTitle =
  `${siteName} — Free Home Improvement Calculators`;

// ==========================================
// SEO METADATA
// ==========================================

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  // Website title
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },

  // Website description
  description: siteDescription,

  // Application information
  applicationName: siteName,

  // Web app manifest
  manifest: '/manifest.webmanifest',

  // Search keywords
  keywords: [
    'home improvement calculator',
    'home renovation calculator',
    'DIY calculator',
    'project cost calculator',
    'construction cost calculator',
    'paint calculator',
    'flooring calculator',
    'tile calculator',
    'concrete calculator',
    'roofing calculator',
    'deck calculator',
    'fence calculator',
    'gravel calculator',
    'drywall calculator',
    'wallpaper calculator',
    'paver calculator',
    'mulch calculator',
    'electricity cost calculator',
    'renovation budget calculator',
    'free home improvement tools',
    'material cost estimator',
  ],

  // Website classification
  category: 'home improvement',

  // Search engine indexing
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

  // Facebook, LinkedIn and social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: siteName,
    title: defaultTitle,
    description: siteDescription,
  },

  // Twitter / X sharing
  twitter: {
    card: 'summary',
    title: defaultTitle,
    description: siteDescription,
  },

  // Browser and device formatting
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

// ==========================================
// MOBILE VIEWPORT CONFIGURATION
// ==========================================

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#151713',
  colorScheme: 'light',
};

// ==========================================
// ROOT LAYOUT
// ==========================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  // ========================================
  // STRUCTURED DATA FOR SEARCH ENGINES
  // ========================================

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',

    name: siteName,
    url: siteUrl,
    description: siteDescription,

    inLanguage: 'en',

    publisher: {
      '@type': 'Organization',
      name: siteName,
      url: siteUrl,
    },
  };

  // Escape potentially unsafe HTML characters
  // before inserting JSON-LD into a script tag.
  const safeJsonLd = JSON.stringify(
    websiteJsonLd
  ).replace(/</g, '\\u003c');

  return (
    <html lang="en">
      <body>

        {/* Analytics and other website scripts */}
        <SiteScripts />

        {/* Structured data for search engines */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: safeJsonLd,
          }}
        />

        {/* Main website navigation */}
        <Header />

        {/* Website page content */}
        <main>
          {children}
        </main>

        {/* Website footer */}
        <Footer />

      </body>
    </html>
  );
}