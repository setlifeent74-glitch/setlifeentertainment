import type { Metadata } from "next";
import { getSectionGateStatuses } from "@/lib/gates";
import { isContentGatesEnabled } from "@/lib/queries";
import ContentGatesToggle from "@/components/admin/ContentGatesToggle";

export const metadata: Metadata = {
  title: "Content Gate Status — Set Life Entertainment",
  robots: { index: false, follow: false },
};

/**
 * §9 "Admin visibility" — dashboard shows each homepage section's gate
 * status (met/unmet, with shortfall) so contributors can see exactly what
 * the homepage needs.
 *
 * Behind auth via the shared /admin/* middleware check (lib/supabase/
 * middleware.ts) — same flat-access model as the rest of the admin surface.
 * Now also writable: the ContentGatesToggle below flips the site-wide §9
 * override (site_settings.content_gates_enabled).
 */
export default async function GateStatusPage() {
  const [gates, gatesEnabled] = await Promise.all([getSectionGateStatuses(), isContentGatesEnabled()]);
  const metCount = gates.filter((g) => g.met).length;

  return (
    <div className="wrap" style={{ paddingTop: 56, paddingBottom: 56 }}>
      <p className="eyebrow">Admin</p>
      <h1 className="display" style={{ fontSize: "clamp(32px, 5vw, 56px)" }}>
        CONTENT GATE STATUS
      </h1>
      <p style={{ color: "var(--gray)", marginTop: 10 }}>
        {metCount} of {gates.length} homepage sections currently meet their §9 minimum-to-render threshold.
        {!gatesEnabled && " Override is ON, so every section shows regardless of this table."}
      </p>

      <div style={{ marginTop: 24 }}>
        <ContentGatesToggle initialEnabled={gatesEnabled} />
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 32 }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--line)", textAlign: "left" }}>
            <th style={{ padding: "10px 12px" }}>Section</th>
            <th style={{ padding: "10px 12px" }}>Status</th>
            <th style={{ padding: "10px 12px" }}>Current</th>
            <th style={{ padding: "10px 12px" }}>Minimum</th>
            <th style={{ padding: "10px 12px" }}>Note</th>
          </tr>
        </thead>
        <tbody>
          {gates.map((gate) => (
            <tr key={gate.id} data-gate-id={gate.id} data-gate-met={gate.met} style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "10px 12px" }}>{gate.label}</td>
              <td style={{ padding: "10px 12px", color: gate.met ? "#4caf50" : "var(--gold)" }}>
                {gate.met ? "Met" : `Unmet — needs ${gate.shortfall} more`}
              </td>
              <td style={{ padding: "10px 12px" }}>{gate.current}</td>
              <td style={{ padding: "10px 12px" }}>{gate.minimum}</td>
              <td style={{ padding: "10px 12px", color: "var(--gray)" }}>{gate.note ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
