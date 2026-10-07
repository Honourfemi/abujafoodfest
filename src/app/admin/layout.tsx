import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const h = await headers();
  // next url path — prefer x-url / referer fallback; use middleware-free check via next-url
  const pathname =
    h.get("x-pathname") ||
    h.get("next-url") ||
    "";

  // Without middleware, detect login via a soft approach: if no session, bare children
  if (!session) {
    return <>{children}</>;
  }

  // Logged in: full shell. Login page will redirect via its own effect if needed.
  return (
    <div className="admin-shell">
      <AdminSidebar email={session.email} />
      <div className="admin-main">{children}</div>
    </div>
  );
}
