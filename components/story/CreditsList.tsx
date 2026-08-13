type Credit = { title: string; year: string; tag?: string };

/**
 * §45/§46 — "Credits/Filmography list... renders the stacked title/year
 * list on a cover-story spotlight." Zero-render discipline (§9/§46): no
 * entries means no box, no empty heading.
 */
export default function CreditsList({ heading = "Featured Projects", credits }: { heading?: string; credits: Credit[] }) {
  const items = credits.filter((c) => c.title.trim());
  if (items.length === 0) return null;

  return (
    <div className="credits-list">
      <p className="eyebrow">{heading}</p>
      <ul>
        {items.map((credit, i) => (
          <li key={i}>
            <span className="credits-title">{credit.title}</span>
            <span className="credits-meta">
              {credit.year}
              {credit.tag && <> · {credit.tag}</>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
