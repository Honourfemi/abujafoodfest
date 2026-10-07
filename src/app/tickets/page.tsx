import { getAllEvents } from "@/lib/queries";
import { PageBanner } from "@/components/PageBanner";
import { TicketForm } from "@/components/TicketForm";

export const dynamic = "force-dynamic";

export default function TicketsPage() {
  const events = (await getAllEvents()).filter((e) => e.id !== "ev-campus-tour" && e.price !== "TBA");
  const eventOptions = events.map(
    (e) => `${e.title} · ${e.date.replace("📅 ", "")}`
  );

  return (
    <>
      <PageBanner
        breadcrumb="Get Tickets"
        eyebrow="Simple & Secure"
        title="Get Your Tickets"
        description="Select your event, choose a ticket type, and you're in. Payment is fast and secure."
      />

      <section className="section">
        <div className="container">
          <div className="ticket-steps">
            <div className="ticket-step active">
              <span className="num">1</span> Select Event
            </div>
            <div className="ticket-step active">
              <span className="num">2</span> Choose Tickets
            </div>
            <div className="ticket-step">
              <span className="num">3</span> Your Info
            </div>
            <div className="ticket-step">
              <span className="num">4</span> Payment
            </div>
            <div className="ticket-step">
              <span className="num">5</span> Confirmation
            </div>
          </div>

          <TicketForm eventOptions={eventOptions} />
        </div>
      </section>
    </>
  );
}
