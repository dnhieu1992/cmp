"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import type { SxProps, Theme } from "@mui/material/styles";
import { Input, Select } from "@/components/ui";
import type { Role } from "@/types/roles";

export type AddUserFormState = {
  email: string;
  first_name: string;
  last_name: string;
  roleId: string;
};

export default function AddUserDialog({
  open,
  onClose,
  roles,
  value,
  onChange,
  onSubmit,
  loading,
  error,
  fieldSx,
}: {
  open: boolean;
  onClose: () => void;
  roles: Role[];
  value: AddUserFormState;
  onChange: (next: AddUserFormState) => void;
  onSubmit: () => void;
  loading?: boolean;
  error?: string | null;
  fieldSx?: SxProps<Theme>;
}) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add user</DialogTitle>
      <DialogContent>
        <div className="mt-2 grid gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-1">
              <div className="text-sm font-semibold text-neutral-800">Email Address</div>
              <Input
                value={value.email}
                onChange={(e) => onChange({ ...value, email: e.target.value })}
                type="email"
                required
                placeholder="Enter email"
                sx={fieldSx}
              />
            </div>

            <div className="grid gap-1">
              <div className="text-sm font-semibold text-neutral-800">Role</div>
              <Select
                value={value.roleId}
                onChange={(e) => onChange({ ...value, roleId: String(e.target.value) })}
                sx={fieldSx}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (v) => {
                    const id = String(v ?? "");
                    if (!id) return <span className="text-neutral-400">Select role</span>;
                    return roles.find((r) => String(r.id) === id)?.name ?? id;
                  },
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {roles.map((role) => (
                  <MenuItem key={role.id} value={String(role.id)}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="grid gap-1">
              <div className="text-sm font-semibold text-neutral-800">First Name</div>
              <Input
                value={value.first_name}
                onChange={(e) => onChange({ ...value, first_name: e.target.value })}
                placeholder="Enter first name"
                sx={fieldSx}
              />
            </div>
            <div className="grid gap-1">
              <div className="text-sm font-semibold text-neutral-800">Last Name</div>
              <Input
                value={value.last_name}
                onChange={(e) => onChange({ ...value, last_name: e.target.value })}
                placeholder="Enter last name"
                sx={fieldSx}
              />
            </div>
          </div>

          {error && <div className="text-sm text-red-600">{error}</div>}
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
            {loading ? "Creating..." : "Add User"}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
