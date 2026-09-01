import type { Metadata } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import './global.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-body' });
const robotoMono = Roboto_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono' });

export const metadata: Metadata = {
  metadataBase: new URL('https://kunal-vaghani-portfolio.vercel.app'),
  title: {
    default: 'Kunal Vaghani — AI/ML Systems & Software Engineer',
    template: '%s · Kunal Vaghani',
  },
  description:
    'AI & Data Science student building local AI infrastructure, information retrieval systems, hardware-aware LLM inference, C++ performance components, reliability, and evaluation for constrained hardware.',
  keywords: [
    'Kunal Vaghani',
    'AI ML systems',
    'local LLM infrastructure',
    'information retrieval',
    'C++ performance engineering',
    'agent runtime',
    'hardware-aware inference',
  ],
  authors: [{ name: 'Kunal Vaghani', url: 'https://github.com/kunalvaghani' }],
  creator: 'Kunal Vaghani',
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Kunal Vaghani — AI/ML Systems',
    title: 'Kunal Vaghani — AI/ML Systems & Software Engineer',
    description: 'Local AI runtimes, retrieval, evaluation, reliability, and hardware-aware inference for constrained systems.',
  },
  twitter: {
    card: 'summary',
    title: 'Kunal Vaghani — AI/ML Systems & Software Engineer',
    description: 'Building inspectable local AI systems for constrained hardware.',
  },
  robots: { index: true, follow: true },
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable}`} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
