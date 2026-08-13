import type { Json } from "@/lib/supabase/types";

type TiptapNode = { type?: string; text?: string; content?: TiptapNode[] };

/**
 * Walks a Tiptap doc and concatenates only actual `text` node content —
 * used for reading-time estimation (§46 VERIFY: "accurate within 20%") and
 * anywhere else that needs the article's real word count or a plain-text
 * excerpt. `JSON.stringify(body).split(/\s+/)` (the pre-Phase-10 heuristic)
 * counts JSON syntax tokens — `"type":`, `"paragraph",` — as words, which
 * is not a word count of the article at all.
 */
export function extractPlainText(body: Json): string {
  if (!body || typeof body !== "object") return "";

  if (Array.isArray(body)) {
    return body
      .map((block) =>
        block && typeof block === "object" && "text" in block && typeof block.text === "string" ? block.text : ""
      )
      .join(" ");
  }

  const doc = body as { type?: string; content?: TiptapNode[] };
  if (doc.type !== "doc" || !Array.isArray(doc.content)) return "";

  const parts: string[] = [];
  const walk = (node: TiptapNode) => {
    if (typeof node.text === "string") parts.push(node.text);
    node.content?.forEach(walk);
  };
  doc.content.forEach(walk);
  return parts.join(" ");
}

export function readingTimeFrom(body: Json): number {
  const words = extractPlainText(body).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
