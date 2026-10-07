import { getGallery } from "@/lib/queries";
import { PageBanner } from "@/components/PageBanner";
import { GalleryGrid } from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export default function GalleryPage() {
  const items = await getGallery();

  return (
    <>
      <PageBanner
        breadcrumb="Gallery"
        eyebrow="Relive the moments"
        title="Gallery"
        description="Food, performances, vendors and unforgettable crowd energy — straight from previous Abuja Food Fest events."
      />

      <section className="section">
        <div className="container">
          <GalleryGrid items={items} />
        </div>
      </section>
    </>
  );
}
