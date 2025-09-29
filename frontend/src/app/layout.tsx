import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NODE_ENV === 'production' ? 'https://ai-trading-platform.com' : 'http://localhost:3000'),
  title: 'AI Trading Analytics Platform',
  description: 'Real-time cryptocurrency trading analytics powered by AI and event-driven architecture',
  keywords: ['trading', 'cryptocurrency', 'AI', 'analytics', 'real-time', 'blockchain'],
  authors: [{ name: 'Ars Machina Consultancy' }],
  creator: 'Ars Machina Consultancy',
  publisher: 'Ars Machina Consultancy',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ai-trading-platform.com',
    title: 'AI Trading Analytics Platform',
    description: 'Real-time cryptocurrency trading analytics powered by AI',
    siteName: 'AI Trading Platform',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Trading Analytics Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Trading Analytics Platform',
    description: 'Real-time cryptocurrency trading analytics powered by AI',
    images: ['/og-image.png'],
    creator: '@arsmachina',
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1e293b',
                color: '#f8fafc',
                border: '1px solid #334155',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#f8fafc',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#f8fafc',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}