"use client";

import { useState, useTransition } from "react";
import { setSectionColor } from "@/app/actions/settings";
import { SECTION_COLOR_IDS, SECTION_COLOR_LABELS, type SectionColorId } from "@/lib/section-colors";

const DEFAULT_SWATCH = "#0a0a0a";

function SectionColorRow({
  id,
  initialColor,
}: {
  id: SectionColorId;
  initialColor?: string;
}) {
  const [appliedColor, setAppliedColor] = useState(initialColor);
  const [pendingColor, setPendingColor] = useState(initialColor ?? DEFAULT_SWATCH);
  const [status, setStatus] = useState<{ message: string; isError: boolean } | null>(null);
  const [isPending, startTransition] = useTransition();

  const apply = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await setSectionColor(id, pendingColor);
      if (result.error) {
        setStatus({ message: result.error, isError: true });
        return;
      }
      setAppliedColor(pendingColor);
      setStatus({ message: "Applied.", isError: false });
    });
  };

  const reset = () => {
    setStatus(null);
    startTransition(async () => {
      const result = await setSectionColor(id, null);
      if (result.error) {
        setStatus({ message: result.error, isError: true });
        return;
      }
      setAppliedColor(undefined);
      setPendingColor(DEFAULT_SWATCH);
      setStatus({ message: "Reset to default.", isError: false });
    });
  };

  return (
    <div className="section-color-row">
      <span className="section-color-label">{SECTION_COLOR_LABELS[id]}</span>
      <input
        type="color"
        value={pendingColor}
        onChange={(e) => setPendingColor(e.target.value)}
        disabled={isPending}
        aria-label={`Canvas color for ${SECTION_COLOR_LABELS[id]}`}
      />
      <button type="button" className="btn" onClick={apply} disabled={isPending}>
        Apply
      </button>
      {appliedColor && (
        <button type="button" onClick={reset} disabled={isPending}>
          Reset
        </button>
      )}
      {status && (
        <span className={status.isError ? "admin-upload-error" : "admin-editor-status"}>{status.message}</span>
      )}
    </div>
  );
}

/**
 * Per-section canvas color override — same pick-then-Apply pattern as the
 * article canvas color and the Tiptap text/box color controls. Each of the
 * 16 homepage sections gets its own swatch; unset = keeps its normal CSS
 * background.
 */
export default function SectionColorsPanel({ initialColors }: { initialColors: Record<string, string> }) {
  return (
    <div className="section-colors-panel">
      <p className="admin-editor-hint" style={{ padding: 0, marginBottom: "var(--space-16)" }}>
        Override the background color behind any homepage section. Pick a color, then click Apply — takes effect on
        the live site immediately.
      </p>
      {SECTION_COLOR_IDS.map((id) => (
        <SectionColorRow key={id} id={id} initialColor={initialColors[id]} />
      ))}
    </div>
  );
}
