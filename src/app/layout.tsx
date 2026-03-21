import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CCS — Facility Services Quoting',
  description: 'Complete Commercial Solutions — Service proposal and quoting dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
