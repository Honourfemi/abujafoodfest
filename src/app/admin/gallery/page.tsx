import { assertAdmin } from "@/lib/admin-guard";
import { getGallery } from "@/lib/queries";
import { AdminGalleryClient } from "@/components/admin/AdminGalleryClient";

export default async function AdminGalleryPage() {
  await assertAdmin();
  const items = await getGallery();

  return (
    <div className="admin-panel active">
      <h2>Manage Gallery</h2>
      <p className="sub">
        Upload images to the server or paste an external URL. Deleting a local upload also removes the file from disk.
      </p>
      <AdminGalleryClient initialItems={items} />
    </div>
  );
}
