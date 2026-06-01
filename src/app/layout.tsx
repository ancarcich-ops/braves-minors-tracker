import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Nav from '@/components/Nav';
import BackgroundFX from '@/components/BackgroundFX';

export const metadata: Metadata = {
  title: 'Braves Farm Tracker',
  description:
    'Daily scores, prospects, risers & slumpers, and transactions across the Atlanta Braves minor-league system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen font-sans">
        <BackgroundFX />
        <Nav />
        <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-12 pt-6">
          <div className="flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
            <span className="inline-block h-3 w-1 rounded-full bg-gradient-to-b from-braves-red to-braves-gold" />
            Unofficial fan project. Live data from the MLB Stats API. Not affiliated with
            MLB or the Atlanta Braves.
          </div>
        </footer>
      </body>
    </html>
  );
}
