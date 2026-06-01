'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, Star, TrendingUp, ArrowLeftRight, Trophy } from 'lucide-react';
import TeamSwitcher from './TeamSwitcher';

const links = [
  { href: '/', label: 'Scores', icon: CalendarDays },
  { href: '/prospects', label: 'Prospects', icon: Star },
  { href: '/movers', label: 'Risers', icon: TrendingUp },
  { href: '/transactions', label: 'Moves', icon: ArrowLeftRight },
  { href: '/top100', label: 'Top 100', icon: Trophy },
];

export default function Nav({ currentTeam }: { currentTeam: string }) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-braves-gold/20 bg-braves-navy/70 backdrop-blur-xl">
      {/* Braves accent stripe */}
      <div className="h-0.5 w-full bg-gradient-to-r from-braves-red via-braves-gold to-braves-red" />
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3">
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-braves-red to-braves-navy text-sm font-black text-white shadow-glow ring-1 ring-braves-gold/40">
              ⚾
            </span>
            <span className="hidden text-[15px] font-bold tracking-tight sm:inline">
              Farm <span className="text-braves-gold">System</span>
            </span>
          </Link>
          <TeamSwitcher current={currentTeam} />
        </div>

        <nav className="flex flex-nowrap items-center gap-0.5 text-sm sm:gap-1">
          {links.map(({ href, label, icon: Icon }) => {
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-2 py-1.5 transition-colors sm:px-2.5 ${
                  active ? 'text-white' : 'text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="hidden md:inline">{label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/10 ring-1 ring-braves-gold/30"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
