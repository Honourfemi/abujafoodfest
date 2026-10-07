import Link from "next/link";
import type { Event } from "@/types";

export function EventCard({ event }: { event: Event }) {
  return (
    <article className="event-card">
      <div className="event-card__img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={event.image_url} alt={event.title} />
        <span className="event-card__badge">{event.badge}</span>
      </div>
      <div className="event-card__body">
        <div className="event-card__meta">
          <span>{event.date}</span>
          <span>{event.location}</span>
        </div>
        <h3>{event.title}</h3>
        <p>{event.description}</p>
        <div className="event-card__foot">
          <span className="event-card__price">{event.price}</span>
          <Link href={`/events/${event.id}`} className="btn btn-primary btn-sm">
            View Event
          </Link>
        </div>
      </div>
    </article>
  );
}
