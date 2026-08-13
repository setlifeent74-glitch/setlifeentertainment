"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { useEffect, useState } from "react";
import { uploadMedia, uploadPdfAsImages } from "@/lib/admin-media";
import type { Json } from "@/lib/supabase/types";

async function uploadImage(file: File): Promise<string | null> {
  return uploadMedia(file, "body");
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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Image,
      Placeholder.configure({ placeholder: "Write the story…" }),
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
        setUploadError(null);
        uploadImage(file)
          .then((url) => {
            if (!url) return;
            const { schema } = view.state;
            const node = schema.nodes.image.create({ src: url, alt: "" });
            const tr = view.state.tr.insert(view.state.selection.from, node);
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
              setUploadError(null);
              try {
                const url = await uploadImage(file);
                if (url) editor.chain().focus().setImage({ src: url, alt: "" }).run();
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
              setUploadError(null);
              setPdfStatus("Reading PDF…");
              try {
                const urls = await uploadPdfAsImages(file, (current, total) => {
                  setPdfStatus(`Uploading page ${current}/${total}…`);
                });
                if (urls.length) {
                  editor
                    .chain()
                    .focus("end")
                    .insertContent(urls.map((src) => ({ type: "image", attrs: { src, alt: "" } })))
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
      <EditorContent editor={editor} />
    </div>
  );
}
