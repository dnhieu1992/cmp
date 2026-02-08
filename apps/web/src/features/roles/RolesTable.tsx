"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import TableUI, { type TableColumn } from "@/components/ui/TableUI";
import type { Role } from "@/types/roles";
import type { Permission } from "@/types/permissions";
import EditRolePermissionsDialog from "@/features/roles/EditRolePermissionsDialog";
import { updateRolePermissions } from "@/services/roles.client";

export default function RolesTable({
  roles,
  permissions,
}: {
  roles: Role[];
  permissions: Permission[];
}) {
  const [data, setData] = useState(roles);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [editingRoleName, setEditingRoleName] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  const codeToId = useMemo(() => {
    const map = new Map<string, number>();
    permissions.forEach((p) => map.set(p.code, p.id));
    return map;
  }, [permissions]);

  const idToCode = useMemo(() => {
    const map = new Map<number, string>();
    permissions.forEach((p) => map.set(p.id, p.code));
    return map;
  }, [permissions]);

  const openEdit = (role: Role) => {
    setEditingRoleId(role.id);
    setEditingRoleName(role.name);
    const ids = (role.permissions ?? [])
      .map((code) => codeToId.get(code))
      .filter((v): v is number => typeof v === "number");
    setSelectedPermissionIds(ids);
    setEditOpen(true);
  };

  const closeEdit = () => setEditOpen(false);

  const togglePermission = (permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const submitEdit = async () => {
    if (!editingRoleId) return;
    setEditLoading(true);
    try {
      await updateRolePermissions(editingRoleId, selectedPermissionIds);
      const codes = selectedPermissionIds
        .map((id) => idToCode.get(id))
        .filter((v): v is string => typeof v === "string");
      setData((prev) =>
        prev.map((r) => (r.id === editingRoleId ? { ...r, permissions: codes } : r)),
      );
      toast.success("Role permissions updated.");
      setEditOpen(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to update role permissions.");
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <>
      <TableUI
        rows={data}
        getRowKey={(role) => role.id}
        emptyState="No roles found."
        containerClassName="mt-6 overflow-x-auto overflow-y-visible rounded-2xl border border-neutral-100"
        columns={
          [
            {
              key: "name",
              header: "Role",
              headerClassName: "px-4 py-3 text-left",
              cellClassName: "px-4 py-5 font-semibold text-neutral-700",
              cell: (role) => role.name,
            },
            {
              key: "permissions",
              header: "Permissions",
              headerClassName: "px-4 py-3 text-left",
              cellClassName: "px-4 py-5 text-sm text-neutral-600",
              cell: (role) => (role.permissions?.length ? role.permissions.join(", ") : "--"),
            },
            {
              key: "actions",
              header: "Actions",
              headerClassName: "px-4 py-3 text-left w-px whitespace-nowrap",
              cellClassName: "px-4 py-5 w-px whitespace-nowrap",
              cell: (role) => (
                <button
                  type="button"
                  onClick={() => openEdit(role)}
                  className="h-9 w-9 rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                >
                  <span className="sr-only">Edit</span>
                  <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-5 w-5">
                    <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>
              ),
            },
          ] satisfies TableColumn<Role>[]
        }
      />

      <EditRolePermissionsDialog
        open={editOpen}
        onClose={closeEdit}
        roleName={editingRoleName}
        permissions={permissions}
        selectedPermissionIds={selectedPermissionIds}
        onTogglePermission={togglePermission}
        onSubmit={submitEdit}
        loading={editLoading}
      />
    </>
  );
}
