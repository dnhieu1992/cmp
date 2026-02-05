import { serverGet } from "@/lib/api";
import type { User } from "@/types/users";

export async function fetchUsers(): Promise<User[]> {
  const response = await serverGet<User[]>("/users", {
    headers: { "Cache-Control": "no-store" },
  });

  return response.data;
}
