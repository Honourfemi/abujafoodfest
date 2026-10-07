import { assertAdmin } from "@/lib/admin-guard";
import { getAllVendorBookings } from "@/lib/queries";
import { AdminVendorsClient } from "@/components/admin/AdminVendorsClient";

export default async function AdminVendorsPage() {
  await assertAdmin();
  const bookings = await getAllVendorBookings();

  return (
    <div className="admin-panel active">
      <h2>Vendor Bookings</h2>
      <p className="sub">Stall registrations from the vendor form.</p>
      <AdminVendorsClient bookings={bookings} />
    </div>
  );
}
