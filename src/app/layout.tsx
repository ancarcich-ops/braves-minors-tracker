import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Braves Farm Tracker',
  description:
    'Daily scores, prospects, risers & slumpers, and transactions across the Atlanta Braves minor-league system.',
};

// Bare root layout: just the document shell. Per-section chrome (the tracker's
// nav/footer, the 162-0 game's full-screen canvas) lives in nested layouts so
// the two apps can share this codebase without sharing UI.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
