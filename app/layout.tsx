import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Footer from '@/components/Footer';
import TikTokPixel from '@/components/TikTokPixel';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ShieldSeller - Protect Your TikTok Shop from Violations',
  description: 'Automatically detect and fix violations before TikTok suspends your account. Monitor SPS scores, get instant alerts, and protect your revenue.',
  keywords: 'TikTok Shop, SPS violations, seller protection, account suspension, compliance tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <TikTokPixel />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}