import type { Metadata } from 'next';
import Nav from '@/components/Nav';

export const metadata: Metadata = {
  title: 'Braves Farm Tracker',
  description:
    'Daily scores, prospects, risers & slumpers, and transactions across the Atlanta Braves minor-league system.',
};

// Chrome for the minor-league tracker. Wraps every tracker route while leaving
// the 162-0 game (outside this route group) untouched.
export default function TrackerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <footer className="mx-auto max-w-5xl px-4 py-10 text-xs text-white/40">
        Unofficial. Data from the MLB Stats API. Not affiliated with MLB or the Atlanta Braves.
      </footer>
    </>
  );
}
