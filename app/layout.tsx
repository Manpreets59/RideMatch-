import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { AuthProvider } from '@/app/auth/contexts/AuthContext'
import { Toaster } from '@/components/ui/toaster'

export const metadata: Metadata = {
  title: {
    default: 'RideMatch - Smart Ride Sharing',
    template: '%s | RideMatch'
  },
  description: 'Connect with travelers heading your way. Smart, affordable, and eco-friendly ride sharing for your community.',
  keywords: ['ride sharing', 'carpooling', 'community travel', 'eco-friendly transport', 'ride matching'],
  authors: [{ name: 'RideMatch Team' }],
  creator: 'RideMatch',
  publisher: 'RideMatch',
  generator: 'Next.js',
  applicationName: 'RideMatch',
  referrer: 'origin-when-cross-origin',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3b82f6' },
    { media: '(prefers-color-scheme: dark)', color: '#1e40af' }
  ],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
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
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ridematch.app', // Replace with your actual domain
    siteName: 'RideMatch',
    title: 'RideMatch - Smart Ride Sharing',
    description: 'Connect with travelers heading your way. Smart, affordable, and eco-friendly ride sharing.',
    images: [
      {
        url: '/og-image.png', // Add this image to your public folder
        width: 1200,
        height: 630,
        alt: 'RideMatch - Smart Ride Sharing',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RideMatch - Smart Ride Sharing',
    description: 'Connect with travelers heading your way. Smart, affordable, and eco-friendly ride sharing.',
    images: ['/og-image.png'],
  },
  metadataBase: new URL('https://ridematch.app'), // Replace with your actual domain
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <head>
        <style>{`
          html {
            font-family: ${GeistSans.style.fontFamily};
            --font-sans: ${GeistSans.variable};
            --font-mono: ${GeistMono.variable};
          }
        `}</style>
        {/* Preconnect to external services for better performance */}
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for Firebase */}
        <link rel="dns-prefetch" href="https://firebase.googleapis.com" />
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        
        {/* Additional meta tags for PWA support */}
        <meta name="application-name" content="RideMatch" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="RideMatch" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        {/* Skip to main content for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg z-50"
        >
          Skip to main content
        </a>
        
        {/* Wrap everything in AuthProvider */}
        <AuthProvider>
          {/* Main content wrapper */}
          <div id="main-content" className="relative">
            {children}
          </div>
          
          {/* Toast notifications */}
          <Toaster />
        </AuthProvider>
        
        {/* Global loading/error boundary could go here */}
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}