"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import TiptapEditor from "./TiptapEditor";
import MetaFieldsPanel, { type MetaValue } from "./MetaFieldsPanel";
import HeroImageUpload from "./HeroImageUpload";
import CalloutField, { type Callout } from "./CalloutField";
import { savePost, publishPost, unpublishPost, deletePost } from "@/app/actions/posts";
import type { Post, Author, PostCategory } from "@/lib/queries";
import type { Database, Json } from "@/lib/supabase/types";

type Revision = Database["public"]["Tables"]["post_revisions"]["Row"];

const CATEGORIES: PostCategory[] = [
  "article",
  "news",
  "spotlight",
  "review",
  "opportunity",
  "festival",
  "below_the_line",
  "production",
  "video",
  "behind_the_lens",
];

const PLACEMENTS: Database["public"]["Enums"]["post_placement"][] = [
  "today",
  "spotlight_feature",
  "fresh_face",
  "call_sheet",
  "below_the_line",
  "production",
  "cut",
  "screening_room",
  "behind_the_lens",
  "opportunity",
  "festival",
];

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** §45 — the article editor. One component for both /admin/posts/new and /admin/posts/[id]. */
export default function PostEditor({
  post,
  authors,
  defaultCategory,
  defaultPlacement,
  revisions,
}: {
  post?: Post;
  authors: Author[];
  defaultCategory?: PostCategory;
  defaultPlacement?: string;
  revisions?: Revision[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [dek, setDek] = useState(post?.dek ?? "");
  const [category, setCategory] = useState<PostCategory>(post?.category ?? defaultCategory ?? "article");
  const [placement, setPlacement] = useState<string>(post?.placement ?? defaultPlacement ?? "");
  const [authorId, setAuthorId] = useState(post?.author_id ?? authors[0]?.id ?? "");
  const [heroImageUrl, setHeroImageUrl] = useState(post?.hero_image_url ?? "");
  const [body, setBody] = useState<Json>(post?.body ?? { type: "doc", content: [{ type: "paragraph" }] });
  const [meta, setMeta] = useState<MetaValue>((post?.meta as MetaValue) ?? {});
  const [seoTitle, setSeoTitle] = useState(post?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(post?.seo_description ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [postId, setPostId] = useState(post?.id);
  const [isPublished, setIsPublished] = useState(post?.status === "published");
  // Same pick-then-Apply pattern as the Tiptap toolbar's color controls —
  // this whole-article background color lives in meta.canvasColor and only
  // takes effect (in local state, then on the next Save/Publish) once
  // Apply is clicked.
  const [pendingCanvasColor, setPendingCanvasColor] = useState((meta.canvasColor as string) || "#0a0a0a");

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  // Pure API call, no state writes or navigation — shared by Save and
  // Publish so a caller that needs to do more work afterward (Publish also
  // calls publishPost) can finish *all* of it before router.replace() runs.
  // Confirmed directly: navigating mid-handler aborts the rest of that
  // handler's execution, since router.replace() onto a dynamic route
  // triggers a real navigation — publishPost() never fired when it was
  // called after the save's router.replace() had already kicked off.
  const savePostRaw = () =>
    savePost({
      id: postId,
      title,
      slug,
      dek,
      category,
      placement: placement as Database["public"]["Enums"]["post_placement"] | "",
      authorId,
      heroImageUrl,
      bodyJson: JSON.stringify(body),
      meta: meta as Json,
      seoTitle,
      seoDescription,
    });

  // Same underlying call whether the post is a draft or already live —
  // savePost only ever updates the row's content, never `status`, so
  // editing a published post and clicking this never unpublishes it. The
  // label/status text below just make that honest for an already-published
  // post: "Update" republishes the edits in place, not "Save Draft".
  const handleSave = async (): Promise<string | null> => {
    setStatus(isPublished ? "Updating…" : "Saving…");
    const result = await savePostRaw();
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return null;
    }
    if (!postId) {
      setPostId(result.id);
      router.replace(`/admin/posts/${result.id}`);
    }
    setStatus(isPublished ? "Updated — live now" : "Saved");
    return result.id;
  };

  const handlePublish = async () => {
    setStatus(postId ? "Publishing…" : "Saving…");
    const isNewPost = !postId;
    const saveResult = await savePostRaw();
    if (saveResult.error) {
      setStatus(`Error: ${saveResult.error}`);
      return;
    }
    const id = saveResult.id;

    setStatus("Publishing…");
    const publishResult = await publishPost(id, slug);
    if (publishResult.error) {
      setStatus(`Error: ${publishResult.error}`);
      return;
    }

    setIsPublished(true);
    setStatus("Published");
    if (isNewPost) {
      setPostId(id);
      router.replace(`/admin/posts/${id}`);
    }
  };

  // Saves the current (possibly still-draft) state, same as Save Draft, then
  // opens the real public article template in a new tab so the contributor
  // can see exactly how it'll look before Publish — without changing status.
  const handlePreview = async () => {
    setStatus("Saving for preview…");
    const result = await savePostRaw();
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }
    if (!postId) {
      setPostId(result.id);
      router.replace(`/admin/posts/${result.id}`);
    }
    setStatus("Saved");
    window.open(`/story/${slug}?preview=1`, "_blank", "noopener");
  };

  const handleUnpublish = async () => {
    if (!postId) return;
    setStatus("Unpublishing…");
    const result = await unpublishPost(postId, slug);
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }
    setIsPublished(false);
    setStatus("Unpublished");
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-main">
        <input
          className="admin-editor-title"
          placeholder="Post title"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
        />
        <div className="admin-field">
          <label htmlFor="post-slug">Slug</label>
          <input
            id="post-slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="post-dek">Dek</label>
          <textarea id="post-dek" value={dek} onChange={(e) => setDek(e.target.value)} rows={2} />
        </div>

        <TiptapEditor content={body} onChange={setBody} />
      </div>

      <div className="admin-editor-sidebar">
        <div className="admin-field">
          <label htmlFor="post-status">Status</label>
          <p id="post-status" className={`admin-status-badge${isPublished ? " admin-status-badge--live" : ""}`}>
            {isPublished ? "Published" : "Draft"}
          </p>
        </div>

        <div className="admin-field">
          <label htmlFor="post-category">Category</label>
          <select id="post-category" value={category} onChange={(e) => setCategory(e.target.value as PostCategory)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="post-placement">Homepage Placement</label>
          <select id="post-placement" value={placement} onChange={(e) => setPlacement(e.target.value)}>
            <option value="">— None (archive only) —</option>
            {PLACEMENTS.map((p) => (
              <option key={p} value={p}>
                {p.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="post-author">Byline</label>
          <select id="post-author" value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label>Hero Image</label>
          <HeroImageUpload value={heroImageUrl} onChange={setHeroImageUrl} />
        </div>

        <div className="admin-field">
          <label>Article Canvas Color</label>
          <div className="admin-canvas-color-row">
            <input
              type="color"
              value={pendingCanvasColor}
              onChange={(e) => setPendingCanvasColor(e.target.value)}
            />
            <button
              type="button"
              className="btn"
              onClick={() => setMeta({ ...meta, canvasColor: pendingCanvasColor })}
            >
              Apply
            </button>
            {typeof meta.canvasColor === "string" && meta.canvasColor && (
              <button
                type="button"
                onClick={() => {
                  const { canvasColor: _drop, ...rest } = meta;
                  setMeta(rest);
                  setPendingCanvasColor("#0a0a0a");
                }}
              >
                Reset
              </button>
            )}
          </div>
          <p className="admin-editor-hint" style={{ padding: 0 }}>
            Background color behind the whole article. Pick a color, then click Apply — takes effect on the next Save/Publish.
          </p>
        </div>

        <MetaFieldsPanel category={category} meta={meta} onChange={setMeta} />

        <CalloutField
          value={meta.callout as Callout | undefined}
          onChange={(callout) => setMeta({ ...meta, callout })}
        />

        <fieldset className="admin-meta-panel">
          <legend>SEO</legend>
          <div className="admin-field">
            <label htmlFor="seo-title">SEO Title</label>
            <input id="seo-title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="seo-description">SEO Description</label>
            <textarea id="seo-description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} rows={2} />
          </div>
        </fieldset>

        {revisions && revisions.length > 0 && (
          <fieldset className="admin-meta-panel">
            <legend>Revision History</legend>
            <ul className="admin-revision-list">
              {revisions.map((rev) => (
                <li key={rev.id}>
                  {new Date(rev.created_at).toLocaleString()} — {rev.edited_by ?? "unknown"}
                </li>
              ))}
            </ul>
          </fieldset>
        )}

        <div className="admin-editor-actions">
          <button type="button" className={isPublished ? "btn btn-primary" : "btn"} onClick={handleSave}>
            {isPublished ? "Update" : "Save Draft"}
          </button>
          <button type="button" className="btn" onClick={handlePreview}>
            Preview
          </button>
          {isPublished ? (
            <button type="button" className="btn btn-gold" onClick={handleUnpublish}>
              Unpublish
            </button>
          ) : (
            <button type="button" className="btn btn-primary" onClick={handlePublish}>
              Publish
            </button>
          )}
          {postId && (
            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => {
                if (confirm("Delete this post permanently? This cannot be undone.")) deletePost(postId);
              }}
            >
              Delete
            </button>
          )}
        </div>
        {status && <p className="admin-editor-status">{status}</p>}
      </div>
    </div>
  );
}
