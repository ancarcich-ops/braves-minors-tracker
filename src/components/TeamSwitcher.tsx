'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronDown } from 'lucide-react';
import { TEAMS, getTeamBySlug } from '@/lib/teams';
import TeamLogo from './TeamLogo';

export default function TeamSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const team = getTeamBySlug(current);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    // Persist for a year and re-render server components with the new team.
    document.cookie = `team=${slug}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <label className="relative flex items-center gap-1.5 rounded-lg border border-braves-gold/30 bg-white/5 pl-1.5 transition-colors hover:bg-white/10">
      <span className="sr-only">Choose team</span>
      <TeamLogo teamId={team.id} name={team.name} size={20} className="shrink-0" />
      <select
        value={current}
        onChange={onChange}
        disabled={pending}
        aria-label="Choose team"
        className="appearance-none bg-transparent py-1.5 pl-0.5 pr-7 text-xs font-semibold text-white outline-none focus:ring-0 disabled:opacity-50 sm:text-sm"
      >
        {TEAMS.map((t) => (
          <option key={t.slug} value={t.slug} className="bg-ink-900 text-white">
            {t.name}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 h-3.5 w-3.5 text-braves-gold" />
    </label>
  );
}
