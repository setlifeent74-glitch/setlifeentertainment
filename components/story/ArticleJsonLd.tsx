import JsonLd from "@/components/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import type { PostWithAuthor } from "@/lib/queries";

export default function ArticleJsonLd({ post, url }: { post: PostWithAuthor; url: string }) {
  const siteUrl = getSiteUrl();
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", url: siteUrl },
    { name: post.category.replace(/_/g, " "), url: `${siteUrl}/category/${post.category}` },
    { name: post.title, url },
  ]);

  return (
    <>
      <JsonLd data={articleJsonLd(post, url)} />
      <JsonLd data={breadcrumb} />
    </>
  );
}
