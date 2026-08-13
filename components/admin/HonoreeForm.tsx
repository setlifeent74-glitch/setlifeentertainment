"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroImageUpload from "./HeroImageUpload";
import { saveHonoree, deleteHonoree } from "@/app/actions/honorees";
import type { Database } from "@/lib/supabase/types";

type Honoree = Database["public"]["Tables"]["honorees"]["Row"];

export default function HonoreeForm({
  honoree,
  posts,
}: {
  honoree?: Honoree;
  posts: { id: string; title: string }[];
}) {
  const router = useRouter();
  const [listYear, setListYear] = useState(honoree?.list_year?.toString() ?? new Date().getFullYear().toString());
  const [rank, setRank] = useState(honoree?.rank?.toString() ?? "");
  const [name, setName] = useState(honoree?.name ?? "");
  const [title, setTitle] = useState(honoree?.title ?? "");
  const [discipline, setDiscipline] = useState(honoree?.discipline ?? "");
  const [portraitUrl, setPortraitUrl] = useState(honoree?.portrait_url ?? "");
  const [citation, setCitation] = useState(honoree?.citation ?? "");
  const [relatedPostId, setRelatedPostId] = useState(honoree?.related_post_id ?? "");
  const [published, setPublished] = useState(honoree?.published ?? false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = async () => {
    setStatus("Saving…");
    const result = await saveHonoree({
      id: honoree?.id,
      listYear: Number(listYear),
      rank,
      name,
      title,
      discipline,
      portraitUrl,
      citation,
      relatedPostId,
      published,
    });
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }
    setStatus("Saved");
    if (!honoree) router.push(`/admin/honorees/${result.id}`);
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-main">
        <input className="admin-editor-title" placeholder="Honoree name" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="admin-field">
          <label htmlFor="honoree-title">Title</label>
          <input id="honoree-title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="honoree-citation">Citation</label>
          <textarea id="honoree-citation" rows={6} value={citation} onChange={(e) => setCitation(e.target.value)} />
        </div>
      </div>

      <div className="admin-editor-sidebar">
        <div className="admin-field">
          <label htmlFor="honoree-year">List Year</label>
          <input id="honoree-year" type="number" value={listYear} onChange={(e) => setListYear(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="honoree-rank">Rank (optional)</label>
          <input id="honoree-rank" type="number" value={rank} onChange={(e) => setRank(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="honoree-discipline">Discipline</label>
          <input id="honoree-discipline" value={discipline} onChange={(e) => setDiscipline(e.target.value)} />
        </div>
        <div className="admin-field">
          <label>Portrait</label>
          <HeroImageUpload value={portraitUrl ?? ""} onChange={setPortraitUrl} />
        </div>
        <div className="admin-field">
          <label htmlFor="honoree-related-post">Related Post</label>
          <select id="honoree-related-post" value={relatedPostId ?? ""} onChange={(e) => setRelatedPostId(e.target.value)}>
            <option value="">— None —</option>
            {posts.map((post) => (
              <option key={post.id} value={post.id}>
                {post.title || "(untitled)"}
              </option>
            ))}
          </select>
        </div>
        <div className="admin-field">
          <label htmlFor="honoree-published">
            <input id="honoree-published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            {" "}Published
          </label>
        </div>

        <div className="admin-editor-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          {honoree && (
            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => {
                if (confirm("Delete this honoree permanently?")) deleteHonoree(honoree.id);
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
