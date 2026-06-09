import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SubTracker — Subscription & Renewal Tracker',
  description: 'Track software subscriptions and renewal schedules',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="bg-gray-50 min-h-screen flex flex-col antialiased">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
