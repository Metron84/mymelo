import React from 'react';
import type { Metadata, Viewport } from 'next';
import SessionProviderWrapper from '@/components/providers/SessionProviderWrapper';
import '../styles/index.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Mr. Melo Sanctuary - Admin Portal',
  description: 'Admin portal for Mr. Melo Sanctuary with NextAuth.js authentication',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
</body>
    </html>
  );
}
