type Callout = { heading: string; icon?: string; items: string[] };

/** §45/§46 — sidebar-style fact box, reusable across any article. Zero-render when unset or empty. */
export default function CalloutBox({ callout }: { callout: Callout | undefined }) {
  const items = (callout?.items ?? []).filter((i) => i.trim());
  if (!callout || !callout.heading.trim() || items.length === 0) return null;

  return (
    <aside className="callout-box">
      <p className="callout-heading">
        {callout.icon && <span aria-hidden="true">{callout.icon} </span>}
        {callout.heading}
      </p>
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </aside>
  );
}
