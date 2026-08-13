"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import HeroImageUpload from "./HeroImageUpload";
import { saveAuthor, deleteAuthor } from "@/app/actions/authors";
import type { Author } from "@/lib/queries";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AuthorForm({ author }: { author?: Author }) {
  const router = useRouter();
  const socialLinks = (author?.social_links as Record<string, string> | null) ?? {};
  const [name, setName] = useState(author?.name ?? "");
  const [slug, setSlug] = useState(author?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(author));
  const [title, setTitle] = useState(author?.title ?? "");
  const [bio, setBio] = useState(author?.bio ?? "");
  const [location, setLocation] = useState(author?.location ?? "");
  const [avatarUrl, setAvatarUrl] = useState(author?.avatar_url ?? "");
  const [instagram, setInstagram] = useState(socialLinks.instagram ?? "");
  const [twitter, setTwitter] = useState(socialLinks.twitter ?? "");
  const [website, setWebsite] = useState(socialLinks.website ?? "");
  const [status, setStatus] = useState<string | null>(null);

  const handleNameChange = (value: string) => {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  };

  const handleSave = async () => {
    setStatus("Saving…");
    const result = await saveAuthor({
      id: author?.id,
      slug,
      name,
      title,
      bio,
      avatarUrl,
      location,
      instagram,
      twitter,
      website,
    });
    if (result.error) {
      setStatus(`Error: ${result.error}`);
      return;
    }
    setStatus("Saved");
    if (!author) router.push(`/admin/authors/${result.id}`);
  };

  return (
    <div className="admin-editor">
      <div className="admin-editor-main">
        <input
          className="admin-editor-title"
          placeholder="Author name"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <div className="admin-field">
          <label htmlFor="author-slug">Slug</label>
          <input
            id="author-slug"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugTouched(true);
            }}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="author-title">Title</label>
          <input id="author-title" placeholder="Contributing Writer, Atlanta" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="author-bio">Bio</label>
          <textarea id="author-bio" rows={6} value={bio} onChange={(e) => setBio(e.target.value)} />
        </div>
        <div className="admin-field">
          <label htmlFor="author-location">Location</label>
          <input id="author-location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
      </div>

      <div className="admin-editor-sidebar">
        <div className="admin-field">
          <label>Avatar</label>
          <HeroImageUpload value={avatarUrl} onChange={setAvatarUrl} />
        </div>

        <fieldset className="admin-meta-panel">
          <legend>Social Links</legend>
          <div className="admin-field">
            <label htmlFor="author-instagram">Instagram</label>
            <input id="author-instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="author-twitter">Twitter / X</label>
            <input id="author-twitter" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
          </div>
          <div className="admin-field">
            <label htmlFor="author-website">Website</label>
            <input id="author-website" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
        </fieldset>

        <div className="admin-editor-actions">
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            Save
          </button>
          {author && (
            <button
              type="button"
              className="admin-delete-btn"
              onClick={() => {
                if (confirm("Delete this author permanently?")) deleteAuthor(author.id);
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
