import Link from 'next/link';

const links = [
  { href: '/', label: 'Scores' },
  { href: '/prospects', label: 'Prospects' },
  { href: '/movers', label: 'Risers & Slumpers' },
  { href: '/transactions', label: 'Transactions' },
];

export default function Nav() {
  return (
    <header className="border-b border-white/10 bg-braves-navy">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-braves-red text-sm">
            A
          </span>
          <span>Braves Farm</span>
        </Link>
        <nav className="flex flex-wrap items-center gap-4 text-sm text-white/70">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
          <Link
            href="/162-0"
            className="rounded-full border border-white/20 px-2.5 py-0.5 text-xs font-semibold text-white/80 hover:bg-white/10 hover:text-white"
          >
            162-0 Game
          </Link>
        </nav>
      </div>
    </header>
  );
}
