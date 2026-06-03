import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '162-0 · Build the Perfect Season',
  description:
    'Spin a team and a decade, draft an all-time MLB lineup one position at a time, then simulate a 162-game season. Can you build the unbeatable team?',
};

// Full-screen ballpark canvas for the game, independent of the tracker chrome.
export default function GameLayout({ children }: { children: React.ReactNode }) {
  return <div className="field-bg min-h-screen">{children}</div>;
}
