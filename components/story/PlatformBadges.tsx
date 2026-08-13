/** §45/§46 — "Now Streaming On" logo row. Zero-render when nothing's selected — no empty badge row. */
export default function PlatformBadges({ heading = "Now Streaming On", platforms }: { heading?: string; platforms: string[] }) {
  if (!platforms || platforms.length === 0) return null;

  return (
    <div className="platform-badges">
      <p className="eyebrow">{heading}</p>
      <ul>
        {platforms.map((platform) => (
          <li key={platform}>{platform}</li>
        ))}
      </ul>
    </div>
  );
}
