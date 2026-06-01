// Official primary club logo, served by org id from MLB's CDN. Plain <img>
// (not next/image) since these are SVGs and we don't want to gate them behind
// the image optimizer / SVG allowlist.

export default function TeamLogo({
  teamId,
  name,
  size = 24,
  className = '',
}: {
  teamId: number;
  name?: string;
  size?: number;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://www.mlbstatic.com/team-logos/${teamId}.svg`}
      alt={name ? `${name} logo` : ''}
      width={size}
      height={size}
      loading="lazy"
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
