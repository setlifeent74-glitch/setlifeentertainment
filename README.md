# Set Life Entertainment

Official website for **Set Life Entertainment** — spotlighting the indie film industry, rising talent, and untold stories across cinema.

Live domain: [setlifeentertainment.com](https://setlifeentertainment.com)

## Structure

Static, no build step required.

```
index.html      Home — full-bleed hero video, latest cover stories
issues.html     Full magazine archive with category filter + search
about.html      Mission, values, timeline
submit.html     "Submit your story" intake form
contact.html    Contact info + message form
style.css       Shared styles (single stylesheet, all pages)
script.js       Shared behavior (hero video controls, nav, filters, forms)
assets/         Images, logo, magazine covers, hero video
```

## Running locally

No dependencies — just serve the folder statically, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly by double-clicking also works.

## Git LFS

`assets/hero-video.mp4` is a large (~309MB) full-quality video tracked via
[Git LFS](https://git-lfs.com) — see `.gitattributes`. Install Git LFS
before cloning/pushing:

```bash
git lfs install
```

`assets/video-hero.MP4` is the original camera export (same content,
pre-optimization) and is intentionally **not** tracked in git — see
`.gitignore` — to avoid storing ~300MB of near-duplicate video twice.

## Deployment

Deployed on [Vercel](https://vercel.com) as a static site, connected to this
GitHub repo. Custom domain `setlifeentertainment.com` is registered at
GoDaddy, with DNS pointed at Vercel.

No environment variables or build command needed — Vercel can deploy this
as a static/"Other" framework project directly.
