/**
 * §47 — renders a JSON-LD `<script>` tag. Escapes `<` so a value
 * containing `</script>` (e.g. a title or bio pulled from the CMS) can't
 * break out of the script tag.
 */
export default function JsonLd({ data }: { data: object }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
