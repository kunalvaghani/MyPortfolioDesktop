import type { Metadata } from 'next';
import './global.css';

export const metadata: Metadata = {
  title: 'KunalOS | Kunal Vaghani Portfolio',
  description:
    'A retro Windows-style game developer portfolio for Kunal Vaghani, featuring engine work, games, AI, 3D models, skills, and contact links.',
  icons: {
    icon: '/icon.svg',
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
