import HonoreeForm from "@/components/admin/HonoreeForm";
import { getAllPostsAdmin } from "@/lib/admin-queries";

export default async function NewHonoreePage() {
  const posts = await getAllPostsAdmin();
  return <HonoreeForm posts={posts.map((p) => ({ id: p.id, title: p.title }))} />;
}
