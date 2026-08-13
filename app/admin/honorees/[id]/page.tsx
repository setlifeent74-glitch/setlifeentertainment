import { notFound } from "next/navigation";
import HonoreeForm from "@/components/admin/HonoreeForm";
import { getAdminHonoreeById, getAllPostsAdmin } from "@/lib/admin-queries";

export default async function EditHonoreePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [honoree, posts] = await Promise.all([getAdminHonoreeById(id), getAllPostsAdmin()]);
  if (!honoree) notFound();
  return <HonoreeForm honoree={honoree} posts={posts.map((p) => ({ id: p.id, title: p.title }))} />;
}
