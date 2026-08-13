"use client";

export type Callout = { heading: string; icon?: string; items: string[] };

/**
 * §45 — "Callout/feature box... Reusable across any article, not
 * spotlight-specific." Universal, so it lives directly in the editor
 * sidebar rather than gated by lib/admin-meta-fields.ts's
 * category-conditional field list (spotlight/review/etc.).
 */
export default function CalloutField({
  value,
  onChange,
}: {
  value: Callout | undefined;
  onChange: (v: Callout | undefined) => void;
}) {
  const callout = value ?? { heading: "", icon: "", items: [] };

  const setField = (patch: Partial<Callout>) => onChange({ ...callout, ...patch });

  return (
    <fieldset className="admin-meta-panel">
      <legend>Callout Box</legend>
      <div className="admin-field">
        <label htmlFor="callout-heading">Heading (e.g. &quot;Platform Features&quot;)</label>
        <input id="callout-heading" value={callout.heading} onChange={(e) => setField({ heading: e.target.value })} />
      </div>
      <div className="admin-field">
        <label htmlFor="callout-icon">Icon (optional, e.g. a single emoji)</label>
        <input id="callout-icon" value={callout.icon ?? ""} onChange={(e) => setField({ icon: e.target.value })} />
      </div>
      <div className="admin-field">
        <label>Bullet Points</label>
        <div className="admin-credits-list">
          {callout.items.map((item, i) => (
            <div key={i} className="admin-credits-row" style={{ gridTemplateColumns: "1fr auto" }}>
              <input
                value={item}
                onChange={(e) =>
                  setField({ items: callout.items.map((v, j) => (j === i ? e.target.value : v)) })
                }
              />
              <button
                type="button"
                onClick={() => setField({ items: callout.items.filter((_, j) => j !== i) })}
                aria-label={`Remove bullet ${i + 1}`}
              >
                ×
              </button>
            </div>
          ))}
          <button type="button" className="btn" onClick={() => setField({ items: [...callout.items, ""] })}>
            + Add Bullet
          </button>
        </div>
      </div>
    </fieldset>
  );
}
