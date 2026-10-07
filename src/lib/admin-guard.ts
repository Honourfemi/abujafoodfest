import { redirect } from "next/navigation";
import { getSession } from "./auth";

/** Call from protected admin pages. Redirects to login if unauthenticated. */
export async function assertAdmin() {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}
