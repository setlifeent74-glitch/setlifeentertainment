import { SECTION_GATES, type SectionGateId } from "./gates";

/**
 * §45 admin dashboard — section tiles in §15's fixed order. Each tile
 * (except Set Life 100 and Instagram, which aren't post-driven) links to
 * the editor with `placement` — and a sensible default `category`, which
 * the contributor can still change — already set, so the enum values stay
 * an implementation detail the editor fills in from the tile clicked, not
 * a field the contributor has to understand.
 */
export const DASHBOARD_TILES: Array<{
  gate: SectionGateId;
  placement: string;
  defaultCategory: string;
}> = [
  { gate: "today", placement: "today", defaultCategory: "news" },
  { gate: "spotlight_feature", placement: "spotlight_feature", defaultCategory: "spotlight" },
  { gate: "call_sheet", placement: "call_sheet", defaultCategory: "news" },
  { gate: "fresh_face", placement: "fresh_face", defaultCategory: "spotlight" },
  { gate: "below_the_line", placement: "below_the_line", defaultCategory: "below_the_line" },
  { gate: "production", placement: "production", defaultCategory: "production" },
  { gate: "cut", placement: "cut", defaultCategory: "review" },
  { gate: "screening_room", placement: "screening_room", defaultCategory: "video" },
  { gate: "behind_the_lens", placement: "behind_the_lens", defaultCategory: "behind_the_lens" },
  { gate: "opportunity", placement: "opportunity", defaultCategory: "opportunity" },
  { gate: "festival", placement: "festival", defaultCategory: "festival" },
];

export function tileLabel(gate: SectionGateId): string {
  // Strip the "§NN " prefix lib/gates.ts uses for the admin gate-status
  // table — the dashboard tile just wants "Today on Set Life", not
  // "§22 Today on Set Life".
  return SECTION_GATES[gate].label.replace(/^§\d+\s/, "");
}
