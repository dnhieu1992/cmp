import { apiClient } from "@/lib/api";

export async function updateUserRoles(userId: number, roleIds: number[]) {
  await apiClient.put(`/users/${userId}/roles`, { roleIds });
}
