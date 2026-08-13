"use client";

import { useState, useTransition } from "react";
import { setContentGatesEnabled } from "@/app/actions/settings";

/**
 * §9 global override switch — lets an admin turn off every homepage
 * section's minimum-to-render threshold at once ("post everything we have
 * right now") and turn it back on once there's enough staff/content to
 * meet each section's usual minimum again.
 */
export default function ContentGatesToggle({ initialEnabled }: { initialEnabled: boolean }) {
  const [enabled, setEnabled] = useState(initialEnabled);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    const next = !enabled;
    setEnabled(next); // optimistic — flipped back on error below
    setError(null);
    startTransition(async () => {
      const result = await setContentGatesEnabled(next);
      if (result.error) {
        setEnabled(!next);
        setError(result.error);
      }
    });
  };

  return (
    <div className="gates-toggle">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        className={`gates-toggle-switch${enabled ? " gates-toggle-switch--on" : ""}`}
        onClick={toggle}
        disabled={isPending}
      >
        <span className="gates-toggle-knob" />
      </button>
      <div className="gates-toggle-copy">
        <strong>{enabled ? "Gates ON" : "Gates OFF"}</strong>
        <span>
          {enabled
            ? "Sections hide until they hit their §9 minimum. Turn off to post everything live right now."
            : "Every section shows whatever's published, ignoring the usual minimum — turn back on once staffed up."}
        </span>
        {error && <span className="admin-upload-error">{error}</span>}
      </div>
    </div>
  );
}
