import ScrollReveal from "@/components/ScrollReveal";
import { getScreeningRoomVideo, getSectionColors } from "@/lib/queries";

type VideoMeta = { videoUrl?: string; captionsUrl?: string; runtime?: string; series?: string };

/** §30 The Screening Room — Gate: 1 video entry, placement=screening_room. */
export default async function ScreeningRoomSection() {
  const [post, colors] = await Promise.all([getScreeningRoomVideo(), getSectionColors()]);
  if (!post) return null;

  const meta = (post.meta ?? {}) as VideoMeta;
  if (!meta.videoUrl) return null;

  return (
    <ScrollReveal
      as="section"
      className="screening-room-section"
      style={colors.screening_room ? { backgroundColor: colors.screening_room } : undefined}
    >
      <div className="wrap">
        <div className="screening-room-header">
          <h2 className="headline mask-reveal"><span>THE SCREENING ROOM</span></h2>
          <p>WATCH SET LIFE</p>
        </div>

        <div className="screening-room-player">
          {/* §30 VERIFY: no autoplay on any video but the hero — controls
              require an explicit click, native keyboard support (space,
              arrows) comes free with the browser's own <video> controls. */}
          <video controls poster={post.hero_image_url ?? undefined} preload="none">
            <source src={meta.videoUrl} type="video/mp4" />
            {meta.captionsUrl && <track kind="captions" src={meta.captionsUrl} label="English" default />}
          </video>
        </div>

        <div className="screening-room-details">
          <h3>{post.title}</h3>
          {post.dek && <p className="screening-room-description">{post.dek}</p>}
          <p className="screening-room-meta">{[meta.series, meta.runtime].filter(Boolean).join(" · ")}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}
