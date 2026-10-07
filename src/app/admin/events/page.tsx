import { assertAdmin } from "@/lib/admin-guard";
import { getAllEvents } from "@/lib/queries";
import { AdminEventsClient } from "@/components/admin/AdminEventsClient";

export default async function AdminEventsPage() {
  await assertAdmin();
  const events = await getAllEvents();

  return (
    <div className="admin-panel active">
      <h2>Manage Events</h2>
      <p className="sub">Add or remove festival events shown on the public site.</p>
      <AdminEventsClient initialEvents={events} />
    </div>
  );
}
