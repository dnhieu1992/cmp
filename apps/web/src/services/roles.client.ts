import { apiClient } from "@/lib/api";

export async function updateRolePermissions(roleId: number, permissionIds: number[]) {
  await apiClient.put(`/roles/${roleId}/permissions`, { permissionIds });
}
