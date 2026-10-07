import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");
  return <AdminLoginForm />;
}
