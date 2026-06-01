import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import Nav from '@/components/Nav';
import BackgroundFX from '@/components/BackgroundFX';
import { getSelectedTeam } from '@/lib/team-server';
import { rgb } from '@/lib/teams';

export const metadata: Metadata = {
  title: 'Farm System — MLB Minor-League Tracker',
  description:
    'Daily scores, prospects, risers & slumpers, and transactions across every MLB organization’s minor-league system.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const team = getSelectedTeam();
  const themeVars = {
    '--brand-navy': rgb(team.colors.primary),
    '--brand-red': rgb(team.colors.accent),
    '--brand-gold': rgb(team.colors.secondary),
  } as React.CSSProperties;

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="min-h-screen font-sans" style={themeVars}>
        <BackgroundFX />
        <Nav currentTeam={team.slug} />
        <main className="mx-auto max-w-5xl px-4 py-6 sm:py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-12 pt-6">
          <div className="flex items-center gap-3 border-t border-white/10 pt-6 text-xs text-slate-500">
            <span className="inline-block h-3 w-1 rounded-full bg-gradient-to-b from-braves-red to-braves-gold" />
            Unofficial fan project. Live data from the MLB Stats API. Not affiliated with MLB or
            any club.
          </div>
        </footer>
      </body>
    </html>
  );
}
