'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ChevronDown } from 'lucide-react';
import { TEAMS } from '@/lib/teams';

export default function TeamSwitcher({ current }: { current: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    // Persist for a year and re-render server components with the new team.
    document.cookie = `team=${slug}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <label className="relative flex items-center">
      <span className="sr-only">Choose team</span>
      <select
        value={current}
        onChange={onChange}
        disabled={pending}
        aria-label="Choose team"
        className="appearance-none rounded-lg border border-braves-gold/30 bg-white/5 py-1.5 pl-2.5 pr-7 text-xs font-semibold text-white outline-none transition-colors hover:bg-white/10 focus:ring-2 focus:ring-braves-gold/40 disabled:opacity-50 sm:text-sm"
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
