import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MERIDIAN — Company Profile 2026',
  description: 'MERIDIAN Group — Global Strategy & Technology Consultancy. Shaping tomorrow\'s enterprises through transformative solutions.',
  keywords: ['consulting', 'strategy', 'technology', 'digital transformation', 'enterprise solutions'],
  authors: [{ name: 'MERIDIAN Group' }],
  openGraph: {
    title: 'MERIDIAN — Company Profile 2026',
    description: 'Global Strategy & Technology Consultancy. Shaping Tomorrow\'s Enterprises.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
