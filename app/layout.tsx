import type { Metadata, Viewport } from 'next';
import { Poppins } from 'next/font/google';
import localFont from 'next/font/local';
import { ThemeProvider } from '@/src/components/providers/ThemeProvider';
import { AppLayout } from '@/src/components/layout/AppLayout';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  weight: ['600', '700'],
  variable: '--font-poppins',
});

const geistSans = localFont({
  src: './fonts/Geist[wght].woff2',
  display: 'swap',
  variable: '--font-geist-sans',
});

const geistMono = localFont({
  src: './fonts/GeistMono[wght].woff2',
  display: 'swap',
  variable: '--font-geist-mono',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Extends the layout under the notch / home bar; safe-area padding is handled
  // per-component.
  viewportFit: 'cover',
  // Android Chrome 108+: when the keyboard appears the layout viewport shrinks,
  // so the chat input stays visible above it. iOS ignores this directive, where
  // useVisualViewportSync takes over instead.
  interactiveWidget: 'resizes-content',
};

export const metadata: Metadata = {
  title: 'Quily Chat',
  description: 'Get instant, accurate answers about Quilibrium from official sources',
  metadataBase: new URL('https://quily.quilibrium.one'),
  manifest: '/manifest.webmanifest',
  openGraph: {
    title: 'Quily Chat',
    description: 'Get instant, accurate answers about Quilibrium from official sources',
    url: 'https://quily.quilibrium.one',
    siteName: 'Quily Chat',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Quily Chat',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quily Chat',
    description: 'Get instant, accurate answers about Quilibrium from official sources',
    images: ['/og-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${poppins.variable} ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider>
          <AppLayout>{children}</AppLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
