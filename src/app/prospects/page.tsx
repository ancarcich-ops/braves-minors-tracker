import { getProspects } from '@/lib/prospects';
import ProspectBoard from '@/components/ProspectBoard';

// Prospect stats refresh a few times a day.
export const revalidate = 900;

export default async function ProspectsPage() {
  const { prospects, season, isMock } = await getProspects();

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Top 30 Prospects</h1>
          <p className="text-sm text-white/50">
            Seeded Braves Top-30 · live {season} stats · re-rank your own board
          </p>
        </div>
        {isMock && (
          <span className="shrink-0 rounded bg-amber-500/20 px-2 py-1 text-xs text-amber-300">
            sample data
          </span>
        )}
      </div>

      <ProspectBoard prospects={prospects} />

      <p className="mt-6 text-xs text-white/40">
        Rankings are a seeded starting point (MLB Pipeline, 2026) you can edit; stats come from the
        MLB Stats API. Custom orderings are saved in your browser.
      </p>
    </div>
  );
}
