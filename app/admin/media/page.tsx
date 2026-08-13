import { getAllMedia } from "@/lib/admin-queries";
import MediaLibrary from "@/components/admin/MediaLibrary";

export default async function AdminMediaPage() {
  const media = await getAllMedia();
  return (
    <div className="admin-list-page">
      <div className="admin-list-header">
        <h1>Media Library</h1>
      </div>
      <MediaLibrary initialMedia={media} />
    </div>
  );
}
