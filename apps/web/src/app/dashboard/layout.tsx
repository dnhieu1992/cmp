import AppShell from "@/components/layout/admin/AppShell";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const token = (await cookies()).get("access_token")?.value;
  if (!token) redirect("/login?next=/dashboard");
  return <AppShell>{children}</AppShell>;
}
