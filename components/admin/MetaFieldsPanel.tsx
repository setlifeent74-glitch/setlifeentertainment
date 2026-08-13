"use client";

import { META_FIELDS_BY_CATEGORY, PLATFORM_OPTIONS, type MetaFieldDef } from "@/lib/admin-meta-fields";
import type { PostCategory } from "@/lib/queries";

type Credit = { title: string; year: string; tag?: string };
export type MetaValue = Record<string, unknown>;

function CreditsListField({ value, onChange }: { value: Credit[]; onChange: (v: Credit[]) => void }) {
  const credits = value ?? [];
  return (
    <div className="admin-credits-list">
      {credits.map((credit, i) => (
        <div key={i} className="admin-credits-row">
          <input
            placeholder="Title"
            value={credit.title}
            onChange={(e) => onChange(credits.map((c, j) => (j === i ? { ...c, title: e.target.value } : c)))}
          />
          <input
            placeholder="Year"
            value={credit.year}
            onChange={(e) => onChange(credits.map((c, j) => (j === i ? { ...c, year: e.target.value } : c)))}
          />
          <input
            placeholder="Tag (optional)"
            value={credit.tag ?? ""}
            onChange={(e) => onChange(credits.map((c, j) => (j === i ? { ...c, tag: e.target.value } : c)))}
          />
          <button type="button" onClick={() => onChange(credits.filter((_, j) => j !== i))} aria-label={`Remove credit ${i + 1}`}>
            ×
          </button>
        </div>
      ))}
      <button type="button" className="btn" onClick={() => onChange([...credits, { title: "", year: "" }])}>
        + Add Credit
      </button>
    </div>
  );
}

function BadgesField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const selected = value ?? [];
  return (
    <div className="admin-badges-field">
      {PLATFORM_OPTIONS.map((platform) => (
        <label key={platform}>
          <input
            type="checkbox"
            checked={selected.includes(platform)}
            onChange={() =>
              onChange(selected.includes(platform) ? selected.filter((p) => p !== platform) : [...selected, platform])
            }
          />
          {platform}
        </label>
      ))}
    </div>
  );
}

/** §45 — renders exactly the meta fields relevant to the selected category, generically, from lib/admin-meta-fields.ts. */
export default function MetaFieldsPanel({
  category,
  meta,
  onChange,
}: {
  category: PostCategory;
  meta: MetaValue;
  onChange: (meta: MetaValue) => void;
}) {
  const fields = META_FIELDS_BY_CATEGORY[category] ?? [];
  if (fields.length === 0) return null;

  const setField = (key: string, value: unknown) => onChange({ ...meta, [key]: value });

  return (
    <fieldset className="admin-meta-panel">
      <legend>Details</legend>
      {fields.map((field: MetaFieldDef) => {
        const fieldId = `meta-${field.key}`;
        return (
          <div key={field.key} className="admin-field">
            <label htmlFor={field.type === "credits-list" || field.type === "badges" ? undefined : fieldId}>
              {field.label}
            </label>
            {field.type === "text" && (
              <input
                id={fieldId}
                value={(meta[field.key] as string) ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
              />
            )}
            {field.type === "textarea" && (
              <textarea
                id={fieldId}
                value={(meta[field.key] as string) ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
              />
            )}
            {field.type === "number" && (
              <input
                id={fieldId}
                type="number"
                value={(meta[field.key] as number) ?? ""}
                onChange={(e) => setField(field.key, e.target.value === "" ? undefined : Number(e.target.value))}
              />
            )}
            {field.type === "datetime" && (
              <input
                id={fieldId}
                type="datetime-local"
                value={(meta[field.key] as string) ?? ""}
                onChange={(e) => setField(field.key, e.target.value)}
              />
            )}
            {field.type === "credits-list" && (
              <CreditsListField value={(meta[field.key] as Credit[]) ?? []} onChange={(v) => setField(field.key, v)} />
            )}
            {field.type === "badges" && (
              <BadgesField value={(meta[field.key] as string[]) ?? []} onChange={(v) => setField(field.key, v)} />
            )}
          </div>
        );
      })}
    </fieldset>
  );
}
