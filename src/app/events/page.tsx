import { getAllEvents } from "@/lib/queries";
import { PageBanner } from "@/components/PageBanner";
import { EventsFilter } from "@/components/EventsFilter";

export const dynamic = "force-dynamic";

export default function EventsPage() {
  const events = await getAllEvents();

  return (
    <>
      <PageBanner
        breadcrumb="Events"
        eyebrow="What's on"
        title="Upcoming Abuja Food Fest Events"
        description="Campus tours, flagship festivals, and everything between — find your next Abuja Food Fest experience."
      />

      <section className="section">
        <div className="container">
          <EventsFilter events={events} />
        </div>
      </section>
    </>
  );
}
