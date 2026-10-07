import { assertAdmin } from "@/lib/admin-guard";
import { getVendorPricing, getPartnerPricing } from "@/lib/queries";
import { AdminPricingClient } from "@/components/admin/AdminPricingClient";

export default async function AdminPricingPage() {
  await assertAdmin();
  const vendor = await getVendorPricing();
  const partner = await getPartnerPricing();

  return (
    <div className="admin-panel active">
      <h2>Pricing</h2>
      <p className="sub">Update vendor stall packages and partnership tier amounts.</p>
      <AdminPricingClient vendor={vendor} partner={partner} />
    </div>
  );
}
