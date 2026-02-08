"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import type { Permission } from "@/types/permissions";

export default function EditRolePermissionsDialog({
  open,
  onClose,
  roleName,
  permissions,
  selectedPermissionIds,
  onTogglePermission,
  onSubmit,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  roleName: string;
  permissions: Permission[];
  selectedPermissionIds: number[];
  onTogglePermission: (permissionId: number) => void;
  onSubmit: () => void;
  loading?: boolean;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Edit role permissions</DialogTitle>
      <DialogContent>
        <div className="mt-2 grid gap-3">
          <div className="grid gap-1">
            <div className="text-sm font-semibold text-neutral-800">Role</div>
            <div className="h-[38px] rounded border border-neutral-200 bg-neutral-50 px-3 text-sm leading-[38px] text-neutral-700">
              {roleName}
            </div>
          </div>

          <div className="grid gap-2">
            <div className="text-sm font-semibold text-neutral-800">Permissions</div>
            <div className="max-h-72 overflow-auto rounded border border-neutral-200">
              {permissions.map((p) => {
                const checked = selectedPermissionIds.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex cursor-pointer items-start gap-3 border-b border-neutral-100 px-3 py-2 last:border-b-0 hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 rounded border-neutral-300"
                      checked={checked}
                      onChange={() => onTogglePermission(p.id)}
                    />
                    <div>
                      <div className="text-sm font-medium text-neutral-800">{p.code}</div>
                      {p.description ? (
                        <div className="text-xs text-neutral-500">{p.description}</div>
                      ) : null}
                    </div>
                  </label>
                );
              })}
              {permissions.length === 0 ? (
                <div className="px-3 py-6 text-center text-sm text-neutral-500">
                  No permissions found.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <div className="flex w-full items-center justify-end gap-3 px-2 pb-2">
          <button
            type="button"
            onClick={onClose}
            className="h-[38px] rounded-full bg-slate-100 px-8 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={!!loading}
            className="h-[38px] rounded-full bg-indigo-600 px-8 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
