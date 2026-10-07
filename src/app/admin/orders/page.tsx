import { assertAdmin } from "@/lib/admin-guard";
import { getAllTicketOrders } from "@/lib/queries";
import { AdminOrdersClient } from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  await assertAdmin();
  const orders = await getAllTicketOrders();

  return (
    <div className="admin-panel active">
      <h2>Ticket Orders</h2>
      <p className="sub">All ticket purchases submitted from the public site.</p>
      <AdminOrdersClient orders={orders} />
    </div>
  );
}
