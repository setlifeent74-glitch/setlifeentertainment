const ITEMS = [
  "NEW ISSUE OUT NOW",
  "CELEBRATING INDIE FILM & RISING TALENT",
  "SUBMIT YOUR STORY",
];

// Flat, doubled sequence of [text, star, text, star, ...] — matches the
// original markup exactly (12 sibling spans, no nesting) so the
// `.marquee-track span{ margin: 0 28px }` rule and the scroll-left
// keyframe's translateX(-50%) tiling both behave identically.
const FLAT: string[] = [];
for (let rep = 0; rep < 2; rep++) {
  for (const item of ITEMS) {
    FLAT.push(item, "★");
  }
}

export default function Marquee() {
  return (
    <div className="marquee">
      <div className="marquee-track">
        {FLAT.map((text, i) => (
          <span key={i}>{text}</span>
        ))}
      </div>
    </div>
  );
}
