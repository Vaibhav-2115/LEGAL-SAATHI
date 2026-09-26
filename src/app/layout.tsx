import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { LegalSaathiProvider } from '../context/LegalSaathiContext';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['500', '600', '700', '800'],
  display: 'swap'
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Legal Saathi — AI-Powered Civic Legal Assistant',
  description: 'Understand your statutory rights, verify facts & evidence, and take confident civil legal action under Indian law.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-background text-on-surface min-h-screen flex flex-col antialiased">
        <LegalSaathiProvider>
          <Header />
          <main className="flex-1 pt-20 w-full">{children}</main>
          <Footer />
        </LegalSaathiProvider>
      </body>
    </html>
  );
}
