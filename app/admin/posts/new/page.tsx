import PostEditor from "@/components/admin/PostEditor";
import { getAllAuthors } from "@/lib/admin-queries";
import type { Database } from "@/lib/supabase/types";
import type { PostCategory } from "@/lib/queries";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; placement?: string }>;
}) {
  const { category, placement } = await searchParams;
  const authors = await getAllAuthors();

  return (
    <PostEditor
      authors={authors}
      defaultCategory={category as PostCategory | undefined}
      defaultPlacement={placement as Database["public"]["Enums"]["post_placement"] | undefined}
    />
  );
}
