import Link from "next/link";
import type { Metadata } from "next";
import { getSectionGateStatuses } from "@/lib/gates";
import { DASHBOARD_TILES, tileLabel } from "@/lib/admin-sections";

export const metadata: Metadata = { title: "Admin Dashboard — Set Life Entertainment", robots: { index: false, follow: false } };

/**
 * §45 — "organized by homepage section, not by database table." Each tile
 * shows the same §9 gate status the public /admin/gates page computes
 * (same lib/gates.ts call) and an "Add to this section" link that opens
 * the editor with category/placement already set.
 */
export default async function AdminDashboardPage() {
  const gates = await getSectionGateStatuses();
  const gateById = Object.fromEntries(gates.map((g) => [g.id, g]));

  return (
    <div className="admin-dashboard">
      <h1>Dashboard</h1>
      <p className="admin-dashboard-intro">
        Each tile is a homepage section. Green means it has enough published content to show on the homepage right
        now; the shortfall is how much more it needs.
      </p>

      <div className="admin-tile-grid">
        {DASHBOARD_TILES.map(({ gate, placement, defaultCategory }) => {
          const status = gateById[gate];
          return (
            <div key={gate} className={`admin-tile${status?.met ? " admin-tile--met" : ""}`}>
              <h2>{tileLabel(gate)}</h2>
              <p className="admin-tile-status">
                {status?.met ? "Ready" : `Needs ${status?.shortfall ?? "?"} more`}
                <span className="admin-tile-count">
                  {" "}
                  ({status?.current ?? 0}/{status?.minimum ?? 0})
                </span>
              </p>
              <Link
                href={`/admin/posts/new?placement=${placement}&category=${defaultCategory}`}
                className="btn btn-gold"
              >
                Add to this section
              </Link>
            </div>
          );
        })}

        <div className={`admin-tile${gateById.set_life_100?.met ? " admin-tile--met" : ""}`}>
          <h2>Set Life 100</h2>
          <p className="admin-tile-status">
            {gateById.set_life_100?.met ? "Ready" : "Needs honorees + admin enable"}
          </p>
          <Link href="/admin/honorees" className="btn btn-gold">
            Manage Honorees
          </Link>
        </div>

        <div className={`admin-tile${gateById.shop?.met ? " admin-tile--met" : ""}`}>
          <h2>The Set Life Shop</h2>
          <p className="admin-tile-status">
            {gateById.shop?.met ? "Ready" : `Needs ${gateById.shop?.shortfall ?? "?"} more`}
          </p>
          <Link href="/admin/products" className="btn btn-gold">
            Manage Products
          </Link>
        </div>

        <div className={`admin-tile${gateById.current_issue?.met ? " admin-tile--met" : ""}`}>
          <h2>Current Magazine Issue</h2>
          <p className="admin-tile-status">{gateById.current_issue?.met ? "Ready" : "No current issue set"}</p>
          <Link href="/admin/issues" className="btn btn-gold">
            Manage Issues
          </Link>
        </div>
      </div>
    </div>
  );
}
