"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useEffect, useState } from "react";
import { uploadMedia, uploadPdfAsImages } from "@/lib/admin-media";
import { StyledBox, Pill, FullBleedImage, type BoxVariant } from "@/lib/tiptap-blocks";
import type { Json } from "@/lib/supabase/types";

async function uploadImage(file: File): Promise<string | null> {
  return uploadMedia(file, "body");
}

/**
 * §41 previously *required* alt text before an image could be inserted at
 * all. Temporarily relaxed to non-blocking, per editorial request — still
 * asks, but Cancel/blank now inserts the image with empty alt text instead
 * of refusing to insert it, so a contributor can get content up now and
 * backfill alt text later.
 */
function promptForAltText(): string {
  const text = window.prompt("Alt text for this image (optional, for accessibility):", "");
  return (text ?? "").trim();
}

/**
 * §45 — "Block-based rich editor... Large section headers... Body copy...
 * Inline image upload via drag-and-drop... Pull quotes." Headers use
 * Tiptap's heading node (rendered in the editorial type system on the
 * public side, Phase 10); pull quotes are the blockquote node, styled as
 * pull quotes there too — no separate "pull quote" node type needed.
 */
export default function TiptapEditor({
  content,
  onChange,
}: {
  content: Json;
  onChange: (json: Json) => void;
}) {
  const [pdfStatus, setPdfStatus] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [pillColor, setPillColor] = useState("#d9a441");
  // Text/box color pickers used to bind their <input type="color"> value
  // directly to editor.getAttributes(...) — a native color-picker
  // interaction can shift focus/selection mid-pick, which made the read-back
  // attribute go empty and the swatch visibly "reset to white" before the
  // color ever got applied. Picking now only updates local state; nothing
  // touches the editor until the Apply button is clicked.
  const [pendingTextColor, setPendingTextColor] = useState("#f5f0e6");
  const [pendingBoxColor, setPendingBoxColor] = useState("#d9a441");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      FullBleedImage,
      Placeholder.configure({ placeholder: "Write the story…" }),
      TextStyle,
      Color,
      StyledBox,
      Pill,
    ],
    content: (content as object) ?? "",
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as unknown as Json);
    },
    editorProps: {
      handleDrop: (view, event) => {
        const file = event.dataTransfer?.files?.[0];
        if (!file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        // Resolve the exact drop position from the mouse coordinates, not
        // the editor's current selection — the upload is async, so by the
        // time it resolves the selection may have moved. This is what makes
        // "drop the image where I dropped it" reliable.
        const coords = { left: event.clientX, top: event.clientY };
        const dropPos = view.posAtCoords(coords)?.pos ?? view.state.selection.from;
        const alt = promptForAltText();
        setUploadError(null);
        uploadImage(file)
          .then((url) => {
            if (!url) return;
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url, alt });
            const tr = view.state.tr.insert(dropPos, node);
            view.dispatch(tr);
          })
          .catch((err) => setUploadError(err instanceof Error ? err.message : "Upload failed."));
        return true;
      },
    },
  });

  // Keep the editor in sync if `content` changes out from under it (e.g.
  // loading a different post) without fighting the user's own typing.
  useEffect(() => {
    if (editor && content && JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
      editor.commands.setContent(content as object);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  // Wrap the current block(s) in a styled box, switch an already-boxed
  // selection to a different variant, or unwrap it back to plain
  // paragraphs — one button per variant, same toggle feel as Pull Quote.
  const toggleBox = (variant: BoxVariant) => {
    if (editor.isActive("styledBox", { variant })) {
      editor.chain().focus().lift("styledBox").run();
    } else if (editor.isActive("styledBox")) {
      editor.chain().focus().updateAttributes("styledBox", { variant }).run();
    } else {
      editor.chain().focus().wrapIn("styledBox", { variant, color: "#d9a441", opacity: 0.12 }).run();
    }
  };

  const insertPill = () => {
    const label = window.prompt("Pill text (e.g. EXCLUSIVE, PREMIERE, INTERVIEW):", "");
    if (!label || !label.trim()) return;
    const insertPos = editor.state.selection.to;
    editor.chain().focus().insertContentAt(insertPos, { type: "pill", attrs: { label: label.trim(), color: pillColor } }).run();
  };

  return (
    <div className="admin-editor-body">
      <div className="admin-editor-toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "active" : ""}>
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive("heading", { level: 3 }) ? "active" : ""}>
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "active" : ""}>
          B
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "active" : ""}>
          I
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "active" : ""}>
          Pull Quote
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "active" : ""}>
          List
        </button>
        <label className="admin-editor-color-btn" title="Pick a text color, then click Apply">
          <input type="color" value={pendingTextColor} onChange={(e) => setPendingTextColor(e.target.value)} />
          Color
        </label>
        <button type="button" onClick={() => editor.chain().focus().setColor(pendingTextColor).run()}>
          Apply Text Color
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetColor().run()}
          disabled={!editor.getAttributes("textStyle").color}
        >
          Clear Color
        </button>

        <button type="button" onClick={() => toggleBox("panel")} className={editor.isActive("styledBox", { variant: "panel" }) ? "active" : ""}>
          Panel
        </button>
        <button type="button" onClick={() => toggleBox("highlight")} className={editor.isActive("styledBox", { variant: "highlight" }) ? "active" : ""}>
          Highlight
        </button>
        <button type="button" onClick={() => toggleBox("stat")} className={editor.isActive("styledBox", { variant: "stat" }) ? "active" : ""}>
          Stat
        </button>
        <label className="admin-editor-color-btn" title="Pick a box color, then click Apply (cursor must be inside a Panel/Highlight/Stat box)">
          <input type="color" value={pendingBoxColor} onChange={(e) => setPendingBoxColor(e.target.value)} />
          Box Color
        </label>
        <button
          type="button"
          onClick={() => editor.chain().focus().updateAttributes("styledBox", { color: pendingBoxColor }).run()}
          disabled={!editor.isActive("styledBox")}
        >
          Apply Box Color
        </button>
        <label className="admin-editor-opacity-control" title="Box background opacity">
          Opacity
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={editor.getAttributes("styledBox").opacity ?? 0.12}
            onChange={(e) => editor.chain().focus().updateAttributes("styledBox", { opacity: parseFloat(e.target.value) }).run()}
            disabled={!editor.isActive("styledBox")}
          />
        </label>

        <label className="admin-editor-color-btn" title="Pill color">
          <input type="color" value={pillColor} onChange={(e) => setPillColor(e.target.value)} />
          Pill
        </label>
        <button type="button" onClick={insertPill}>
          + Pill
        </button>

        <label className="admin-editor-image-btn">
          Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              // Capture where the cursor was *before* the upload (and the
              // alt-text prompt, which steals focus) so the image lands
              // exactly where the contributor placed the cursor, not
              // wherever focus happens to land after the upload finishes.
              const insertPos = editor.state.selection.to;
              const alt = promptForAltText();
              setUploadError(null);
              try {
                const url = await uploadImage(file);
                if (url) editor.chain().focus().insertContentAt(insertPos, { type: "image", attrs: { src: url, alt } }).run();
              } catch (err) {
                setUploadError(err instanceof Error ? err.message : "Upload failed.");
              }
            }}
          />
        </label>
        <label className="admin-editor-image-btn">
          {pdfStatus ?? "PDF"}
          <input
            type="file"
            accept="application/pdf"
            hidden
            disabled={!!pdfStatus}
            onChange={async (e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              if (!file) return;
              // One prompt covers every page — per-page prompts would be
              // impractical for a multi-page PDF — auto-suffixed with the
              // page number so each image still gets distinct alt text.
              // Position captured up front, same reasoning as the Image
              // button: PDF rendering + upload takes seconds per page, so
              // pages land where the cursor was, not wherever focus drifts.
              const insertPos = editor.state.selection.to;
              const altBase = promptForAltText();
              setUploadError(null);
              setPdfStatus("Reading PDF…");
              try {
                const urls = await uploadPdfAsImages(file, (current, total) => {
                  setPdfStatus(`Uploading page ${current}/${total}…`);
                });
                if (urls.length) {
                  editor
                    .chain()
                    .focus()
                    .insertContentAt(
                      insertPos,
                      urls.map((src, i) => ({
                        type: "image",
                        attrs: {
                          src,
                          alt: altBase ? (urls.length > 1 ? `${altBase} (page ${i + 1} of ${urls.length})` : altBase) : "",
                          // PDF pages are full magazine-page graphics, not
                          // inline photos — render wide, not squeezed into
                          // the narrow body-text column.
                          fullBleed: true,
                        },
                      }))
                    )
                    .run();
                }
              } catch (err) {
                setUploadError(err instanceof Error ? err.message : "PDF upload failed.");
              } finally {
                setPdfStatus(null);
              }
            }}
          />
        </label>
      </div>
      {uploadError && <p className="admin-upload-error">{uploadError}</p>}
      <p className="admin-editor-hint">
        Images upload to wherever your cursor is, and can be dragged to a new spot afterward. Select a paragraph and click
        Panel/Highlight/Stat to box it — click the same variant again to remove the box. For any color swatch, pick the color
        first, then click its Apply button to commit it — nothing changes until you click Apply.
      </p>
      <EditorContent editor={editor} />
    </div>
  );
}
