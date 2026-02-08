import { serverGet } from "@/lib/api";
import type { Permission } from "@/types/permissions";

export async function fetchPermissions(): Promise<Permission[]> {
  const response = await serverGet<Permission[]>("/permissions", {
    headers: { "Cache-Control": "no-store" },
  });
  return response.data;
}
