import { serverGet } from "@/lib/api";
import type { Role } from "@/types/roles";

export async function fetchRoles(): Promise<Role[]> {
  const response = await serverGet<Role[]>("/roles", {
    headers: { "Cache-Control": "no-store" },
  });

  return response.data;
}
