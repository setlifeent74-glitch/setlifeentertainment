import { createClient } from "@/lib/supabase/server";

/**
 * §9 Content Readiness Gates — single source of truth for every homepage
 * section's minimum-to-render threshold. Section components (Phase 6+)
 * import the relevant entry's `minimum` rather than hardcoding the number
 * from the spec table a second time; this file is also what the admin gate
 * status page (§9 "Admin visibility") reads to build its display.
 */
export const SECTION_GATES = {
  today: { label: "§22 Today on Set Life", minimum: 3 },
  current_issue: { label: "§23 Current Magazine Issue", minimum: 1 },
  spotlight_feature: { label: "§24 Indie Spotlight", minimum: 1 },
  call_sheet: { label: "§25 The Call Sheet", minimum: 5, staleAfterDays: 14 },
  below_the_line: { label: "§26 Below the Line", minimum: 3 },
  fresh_face: { label: "§27 Fresh Faces", minimum: 4 },
  production: { label: "§28 Now in Production", minimum: 3 },
  cut: { label: "§29 The Cut", minimum: 1 },
  screening_room: { label: "§30 The Screening Room", minimum: 1 },
  behind_the_lens: { label: "§31 Behind the Lens", minimum: 1 },
  opportunity: { label: "§32 Opportunities", minimum: 3 },
  festival: { label: "§33 Festival Circuit", minimum: 2 },
  set_life_100: { label: "§34 Set Life 100", minimum: 1 },
  shop: { label: "§35 The Set Life Shop", minimum: 1 },
  instagram: { label: "§36 From @setlifeentertainment", minimum: 0 },
} as const;

export type SectionGateId = keyof typeof SECTION_GATES;

/** Age in days of an ISO timestamp, as of now. Kept out of any component
 * body — `Date.now()` there trips the react-hooks/purity lint rule. */
export function ageInDays(iso: string): number {
  return (Date.now() - new Date(iso).getTime()) / 86_400_000;
}

export type GateStatus = {
  id: SectionGateId;
  label: string;
  minimum: number;
  current: number;
  met: boolean;
  shortfall: number;
  note?: string;
};

const PLACEMENT_GATES = [
  "today",
  "spotlight_feature",
  "call_sheet",
  "below_the_line",
  "fresh_face",
  "production",
  "cut",
  "screening_room",
  "behind_the_lens",
] as const satisfies readonly SectionGateId[];

export async function getSectionGateStatuses(): Promise<GateStatus[]> {
  const supabase = await createClient();

  const placementCounts = await Promise.all(
    PLACEMENT_GATES.map(async (id) => {
      const { count } = await supabase
        .from("posts")
        .select("id", { count: "exact", head: true })
        .eq("placement", id)
        .eq("status", "published");
      return [id, count ?? 0] as const;
    })
  );

  let callSheetNote: string | undefined;
  {
    const { data: newest } = await supabase
      .from("posts")
      .select("published_at")
      .eq("placement", "call_sheet")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (newest?.published_at) {
      const ageDays = ageInDays(newest.published_at);
      if (ageDays > SECTION_GATES.call_sheet.staleAfterDays) {
        callSheetNote = `Newest item is ${Math.floor(ageDays)} days old — exceeds the ${SECTION_GATES.call_sheet.staleAfterDays}-day staleness limit.`;
      }
    }
  }

  const nowIso = new Date().toISOString();
  const today = nowIso.slice(0, 10);

  const [
    { count: currentIssueCount },
    { count: opportunityCount },
    { count: festivalCount },
    { count: shopCount },
    { data: settings },
  ] = await Promise.all([
    supabase.from("magazine_issues").select("id", { count: "exact", head: true }).eq("is_current", true),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("placement", "opportunity")
      .eq("status", "published")
      .or(`meta->>deadline.is.null,meta->>deadline.gte.${nowIso}`),
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("placement", "festival")
      .eq("status", "published")
      .or(`meta->>endDate.is.null,meta->>endDate.gte.${today}`),
    supabase.from("products").select("id", { count: "exact", head: true }).eq("published", true),
    supabase.from("site_settings").select("set_life_100_enabled").eq("id", true).single(),
  ]);

  let set100Count = 0;
  let set100Note: string | undefined;
  const adminEnabled = settings?.set_life_100_enabled ?? false;
  {
    const { data: latestYear } = await supabase
      .from("honorees")
      .select("list_year")
      .eq("published", true)
      .order("list_year", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (latestYear?.list_year != null) {
      const { count } = await supabase
        .from("honorees")
        .select("id", { count: "exact", head: true })
        .eq("published", true)
        .eq("list_year", latestYear.list_year);
      set100Count = count ?? 0;
    }
    if (!adminEnabled) set100Note = "Admin has not enabled this section.";
  }

  const counts: Record<SectionGateId, number> = Object.fromEntries(placementCounts) as Record<
    SectionGateId,
    number
  >;
  counts.current_issue = currentIssueCount ?? 0;
  counts.opportunity = opportunityCount ?? 0;
  counts.festival = festivalCount ?? 0;
  counts.shop = shopCount ?? 0;
  counts.set_life_100 = set100Count;
  counts.instagram = 0; // §36 fallback-grid integration not yet built — see note below.

  return (Object.keys(SECTION_GATES) as SectionGateId[]).map((id) => {
    const gate = SECTION_GATES[id];
    const current = counts[id];
    let met = current >= gate.minimum;
    let note: string | undefined;

    if (id === "call_sheet" && callSheetNote) {
      met = false;
      note = callSheetNote;
    }
    if (id === "set_life_100") {
      met = met && adminEnabled;
      note = set100Note;
    }
    if (id === "instagram") {
      met = true;
      note = "Not yet built (§36, Phase 8) — CMS fallback grid path is the default until then.";
    }

    return {
      id,
      label: gate.label,
      minimum: gate.minimum,
      current,
      met,
      shortfall: Math.max(0, gate.minimum - current),
      note,
    };
  });
}
