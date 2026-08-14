"use client";

export type ImageFit = "cover" | "contain";
export type ImagePosition = "top" | "center" | "bottom";

/**
 * Shared crop/position control for every image upload in the admin —
 * hero images, homepage card images, author avatars, issue covers,
 * honoree portraits, product images. "Crop to Fill" (default) fills its
 * box and may cut off the top/bottom of a tall photo; the Top/Center/
 * Bottom buttons choose what stays visible when cropping. "Show Full
 * Image" never crops, letterboxing instead if the proportions don't
 * match. No separate Apply step — these are simple presets, not native
 * color inputs, so a click applies immediately (persists on the form's
 * own Save/Update).
 */
export default function ImageFitControl({
  fit,
  position,
  onFitChange,
  onPositionChange,
  label = "Image Display",
  hideFitToggle = false,
}: {
  fit: ImageFit;
  position: ImagePosition;
  onFitChange: (fit: ImageFit) => void;
  onPositionChange: (position: ImagePosition) => void;
  label?: string;
  /** When this image's crop-vs-full behavior is fixed by where it's used
   * (not admin-choosable), skip the Crop to Fill / Show Full Image buttons
   * and only show the Top/Center/Bottom focal-point picker. */
  hideFitToggle?: boolean;
}) {
  return (
    <div className="admin-field">
      <label>{label}</label>
      {!hideFitToggle && (
        <div className="hero-fit-row">
          <button
            type="button"
            className={fit === "cover" ? "btn btn-primary" : "btn"}
            onClick={() => onFitChange("cover")}
          >
            Crop to Fill
          </button>
          <button
            type="button"
            className={fit === "contain" ? "btn btn-primary" : "btn"}
            onClick={() => onFitChange("contain")}
          >
            Show Full Image
          </button>
        </div>
      )}
      {(hideFitToggle || fit === "cover") && (
        <div className="hero-fit-row" style={{ marginTop: hideFitToggle ? 0 : 8 }}>
          {(["top", "center", "bottom"] as const).map((pos) => (
            <button
              key={pos}
              type="button"
              className={position === pos ? "btn btn-primary" : "btn"}
              onClick={() => onPositionChange(pos)}
            >
              {pos[0].toUpperCase() + pos.slice(1)}
            </button>
          ))}
        </div>
      )}
      <p className="admin-editor-hint" style={{ padding: 0 }}>
        {hideFitToggle
          ? "This image crops to fill its frame in a few homepage sections (Spotlight, Festival Circuit, Below the Line, Fresh Faces, Instagram grid) — pick which part stays visible."
          : <>&quot;Crop to Fill&quot; fills the frame and may cut off the top or bottom of tall photos — pick which part stays visible above. &quot;Show Full Image&quot; never crops, letterboxing instead if needed.</>}
      </p>
    </div>
  );
}
