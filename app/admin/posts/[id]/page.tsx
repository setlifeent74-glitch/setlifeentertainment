import { notFound } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { getAdminPostById, getAllAuthors, getPostRevisions } from "@/lib/admin-queries";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [post, authors, revisions] = await Promise.all([
    getAdminPostById(id),
    getAllAuthors(),
    getPostRevisions(id),
  ]);

  if (!post) notFound();

  return <PostEditor post={post} authors={authors} revisions={revisions} />;
}
