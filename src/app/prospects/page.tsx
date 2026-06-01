import { getProspects } from '@/lib/prospects';
import { getSelectedTeam } from '@/lib/team-server';
import ProspectBoard from '@/components/ProspectBoard';
import { Reveal } from '@/components/motion';

// Prospect stats refresh a few times a day.
export const revalidate = 900;

export default async function ProspectsPage() {
  const team = getSelectedTeam();
  const { prospects, season, isMock, curated } = await getProspects(team);

  return (
    <div>
      <Reveal>
        <div className="mb-6">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-braves-red">
              {team.short} · Top of the System
            </span>
            {isMock && (
              <span className="rounded-full bg-braves-gold/15 px-2 py-0.5 text-[10px] font-semibold text-braves-gold ring-1 ring-braves-gold/30">
                sample data
              </span>
            )}
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Prospects</h1>
          <p className="mt-1 text-sm text-slate-400">
            {curated
              ? `Seeded ${team.short} Top-30 · live ${season} stats · re-rank your own board`
              : `Auto-ranked from ${team.short} affiliate rosters · live ${season} stats`}
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <ProspectBoard prospects={prospects} storageScope={team.slug} />
      </Reveal>

      <p className="mt-6 text-xs text-slate-500">
        {curated
          ? 'Rankings are a seeded starting point (MLB Pipeline, 2026) you can edit; stats come from the MLB Stats API. Custom orderings are saved in your browser.'
          : 'No curated Top-30 for this club yet — this list is auto-generated from the org’s affiliate rosters (youngest at the highest levels) until a ranked seed is added. Stats come from the MLB Stats API.'}
      </p>
    </div>
  );
}
