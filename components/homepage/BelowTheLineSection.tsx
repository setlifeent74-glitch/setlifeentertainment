import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import { getBelowTheLinePosts, isContentGatesEnabled, getSectionColors } from "@/lib/queries";
import { SECTION_GATES } from "@/lib/gates";
import type { PostWithAuthor } from "@/lib/queries";

// Six distinct (column span, row span) pairs — §26 VERIFY: "no two mosaic
// tiles share identical dimensions." Order matches getBelowTheLinePosts()'s
// newest-first result: the newest profile gets the lead tile.
const MOSAIC_SPANS = [
  { tile: "lead", cols: 7, rows: 3 },
  { tile: "medium", cols: 5, rows: 2 },
  { tile: "medium", cols: 4, rows: 2 },
  { tile: "compact", cols: 3, rows: 1 },
  { tile: "compact", cols: 4, rows: 1 },
  { tile: "compact", cols: 2, rows: 1 },
] as const;

function MosaicTile({ post, span }: { post: PostWithAuthor; span: (typeof MOSAIC_SPANS)[number] }) {
  const meta = (post.meta ?? {}) as { department?: string };
  return (
    <Link
      href={`/story/${post.slug}`}
      className={`btl-tile btl-tile--${span.tile}`}
      style={{ gridColumn: `span ${span.cols}`, gridRow: `span ${span.rows}` }}
    >
      {post.hero_image_url && <Image src={post.hero_image_url} alt="" fill sizes="(max-width: 767px) 100vw, 40vw" />}
      <div className="btl-tile-overlay">
        {meta.department && <span className="btl-department">{meta.department}</span>}
        <span className="btl-name">{post.title}</span>
      </div>
    </Link>
  );
}

/** §26 Below the Line — Signature Section. Gate: 3 crew posts, placement=below_the_line (unless the §9 admin override is on). */
export default async function BelowTheLineSection() {
  const [posts, gatesEnabled, colors] = await Promise.all([
    getBelowTheLinePosts(),
    isContentGatesEnabled(),
    getSectionColors(),
  ]);
  if (gatesEnabled && posts.length < SECTION_GATES.below_the_line.minimum) return null;
  if (posts.length === 0) return null;

  return (
    <ScrollReveal
      as="section"
      className="btl-section"
      style={colors.below_the_line ? { backgroundColor: colors.below_the_line } : undefined}
    >
      <div className="wrap">
        <div className="btl-header">
          <h2 className="headline mask-reveal"><span>BELOW THE LINE</span></h2>
          <p>THE PEOPLE WHO MAKE THE MOVIE POSSIBLE</p>
        </div>

        <div className="btl-mosaic">
          {posts.slice(0, 6).map((post, i) => (
            <MosaicTile key={post.id} post={post} span={MOSAIC_SPANS[i]} />
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
