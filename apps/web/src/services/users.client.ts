import { apiClient } from "@/lib/api";
import type { User } from "@/types/users";

export async function updateUserRoles(userId: number, roleIds: number[]) {
  await apiClient.put(`/users/${userId}/roles`, { roleIds });
}

export type CreateUserPayload = {
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  roleId?: number | null;
};

export async function createUser(payload: CreateUserPayload) {
  const res = await apiClient.post<{ user: User }>(`/users`, payload);
  return res.data;
}

export type UpdateUserPayload = {
  email?: string;
  first_name?: string | null;
  last_name?: string | null;
  roleId?: number | null;
};

export async function updateUser(userId: number, payload: UpdateUserPayload) {
  const res = await apiClient.put<{ user: User }>(`/users/${userId}`, payload);
  return res.data;
}

export async function deleteUser(userId: number) {
  await apiClient.delete(`/users/${userId}`);
}
