import { Node, mergeAttributes } from "@tiptap/core";
import TiptapImage from "@tiptap/extension-image";

/**
 * Magazine-layout blocks for the §45 admin editor: styled boxes (panel /
 * highlight / stat) and inline pills. Both expose a `color` (hex) and, for
 * boxes, an `opacity` (0-1) attribute so a contributor can restyle each
 * instance rather than being locked to one fixed look — mirrors how the
 * text-color toolbar control works, just at the block level.
 *
 * These are plain attribute-driven nodes (no custom NodeViews) so they stay
 * consistent with the rest of this editor's low-complexity approach —
 * insertion/editing happens via toolbar buttons + prompts, same pattern as
 * image alt text.
 */

export type BoxVariant = "panel" | "highlight" | "stat";

export const StyledBox = Node.create({
  name: "styledBox",
  group: "block",
  content: "block+",
  defining: true,

  addAttributes() {
    return {
      variant: { default: "panel" as BoxVariant },
      color: { default: "#d9a441" },
      opacity: { default: 0.12 },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-styled-box]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, {
        "data-styled-box": node.attrs.variant,
        style: `--box-color:${node.attrs.color}; --box-opacity:${node.attrs.opacity};`,
      }),
      0,
    ];
  },
});

export const Pill = Node.create({
  name: "pill",
  group: "inline",
  inline: true,
  atom: true,
  selectable: true,

  addAttributes() {
    return {
      label: { default: "" },
      color: { default: "#d9a441" },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-pill]" }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-pill": "",
        style: `--pill-color:${node.attrs.color};`,
      }),
      node.attrs.label ?? "",
    ];
  },
});

/**
 * Standard Image node plus one extra attribute: `fullBleed`. A PDF page
 * rendered to an image is often a whole magazine-page graphic with fine
 * detail baked in — squeezed into the ~760px body-text column it becomes
 * illegibly small. PDF uploads set fullBleed: true; the regular Image
 * button/drag-drop leave it at the default false. The public renderer
 * (app/story/[slug]/page.tsx) reads this to pick a wide breakout layout
 * instead of the normal in-column image treatment.
 */
export const FullBleedImage = TiptapImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fullBleed: {
        default: false,
        parseHTML: (element: HTMLElement) => element.hasAttribute("data-full-bleed"),
        renderHTML: (attributes: { fullBleed?: boolean }) =>
          attributes.fullBleed ? { "data-full-bleed": "" } : {},
      },
    };
  },
});
