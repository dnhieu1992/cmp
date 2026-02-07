"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";
import type { User } from "@/types/users";
import type { Role } from "@/types/roles";
import { createUser, deleteUser, updateUser, updateUserRoles } from "@/services/users.client";
import TableUI, { type TableColumn } from "@/components/ui/TableUI";
import AddUserDialog, { type AddUserFormState } from "@/features/users/AddUserDialog";
import EditUserDialog, { type EditUserFormState } from "@/features/users/EditUserDialog";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

type UsersRoleTableProps = {
  users: User[];
  roles: Role[];
};

function RoleSelect({
  roles,
  selectedRoleId,
  disabled,
  onChange,
}: {
  roles: Role[];
  selectedRoleId: number | null;
  disabled?: boolean;
  onChange: (nextRoleId: number | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ top: number; left: number; width: number } | null>(null);

  const updatePos = () => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: rect.width,
    });
  };

  useEffect(() => {
    if (!open) return;

    updatePos();

    const onPointerDown = (event: PointerEvent) => {
      const el = rootRef.current;
      const dropdownEl = dropdownRef.current;
      if (!el) return;
      if (event.target instanceof Node && el.contains(event.target)) return;
      if (dropdownEl && event.target instanceof Node && dropdownEl.contains(event.target)) return;
      setOpen(false);
    };

    const onScrollOrResize = () => updatePos();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", onScrollOrResize, true);
    window.addEventListener("resize", onScrollOrResize);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const label = selectedRoleId
    ? (roles.find((r) => r.id === selectedRoleId)?.name ?? "Select role")
    : "Select role";

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!open) updatePos();
          setOpen((v) => !v);
        }}
        className="flex h-10 w-44 items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 text-left text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-60"
      >
        <span className="truncate">{label}</span>
        <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-neutral-500">
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open &&
        pos &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{ position: "fixed", top: pos.top, left: pos.left, width: pos.width }}
            className="z-[1000] overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg"
          >
            <div className="max-h-56 overflow-auto p-2">
              {roles.map((role) => {
                const active = selectedRoleId === role.id;
                return (
                  <button
                    key={role.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(role.id);
                      setOpen(false);
                    }}
                    className={
                      active
                        ? "flex w-full items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 text-left text-sm font-semibold text-indigo-700"
                        : "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50"
                    }
                  >
                    <span>{role.name}</span>
                    {active && (
                      <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default function UsersRoleTable({ users, roles }: UsersRoleTableProps) {
  const [data, setData] = useState(users);
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [newUser, setNewUser] = useState<AddUserFormState>({
    email: "",
    first_name: "",
    last_name: "",
    roleId: "",
  });
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<EditUserFormState>({
    email: "",
    first_name: "",
    last_name: "",
    roleId: "",
  });
  const [removeOpen, setRemoveOpen] = useState(false);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [removeUserId, setRemoveUserId] = useState<number | null>(null);

  const statusOptions = ["all", "active", "inactive", "suspended"];
  const dialogFieldSx = {
    "& .MuiOutlinedInput-root": {
      height: 38,
      borderRadius: "8px",
      backgroundColor: "#fff",
    },
    "& .MuiOutlinedInput-input": {
      padding: "0 12px",
      fontSize: 14,
    },
    "& input::placeholder": {
      color: "#9ca3af", // neutral-400
      opacity: 1,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e5e7eb", // neutral-200
      borderRadius: "8px",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#d1d5db", // neutral-300
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#c7c7c7",
      borderWidth: "1px",
    },
  } as const;

  const handleChange = (userId: number, roleIds: number[]) => {
    const prev = data;
    setData((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              roles: roles.filter((role) => roleIds.includes(role.id)),
            }
          : user,
      ),
    );

    startTransition(async () => {
      try {
        await updateUserRoles(userId, roleIds);
        toast.success("Role updated.");
      } catch (e) {
        setData(prev);
        toast.error(e instanceof Error ? e.message : "Unable to update role.");
      }
    });
  };

  const filteredUsers = useMemo(() => {
    const search = query.trim().toLowerCase();

    return data.filter((user) => {
      const fullName = `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim();
      const matchesSearch =
        !search ||
        fullName.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

      const matchesRole =
        roleFilter === "all" || (user.roles ?? []).some((role) => role.id === Number(roleFilter));

      const statusLabel = (user.status ?? "").toLowerCase();
      const computedStatus = user.is_deleted ? "inactive" : "active";
      const normalizedStatus = statusLabel || computedStatus;
      const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [data, query, roleFilter, statusFilter]);

  const total = filteredUsers.length;

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    if (page > totalPages) setPage(totalPages);
  }, [page, pageSize, total]);

  const resetToFirstPage = () => setPage(1);

  const openAddDialog = () => {
    setAddError(null);
    setNewUser({ email: "", first_name: "", last_name: "", roleId: "" });
    setAddOpen(true);
  };

  const closeAddDialog = () => {
    setAddOpen(false);
  };

  const openEditDialog = (user: User) => {
    setEditError(null);
    setEditUserId(user.id);
    setEditForm({
      email: user.email,
      first_name: user.first_name ?? "",
      last_name: user.last_name ?? "",
      roleId: (user.roles ?? [])[0]?.id ? String((user.roles ?? [])[0]!.id) : "",
    });
    setEditOpen(true);
  };

  const closeEditDialog = () => setEditOpen(false);

  const submitEditUser = async () => {
    if (!editUserId) return;
    setEditError(null);

    const email = editForm.email.trim();
    if (!email) {
      setEditError("Email is required.");
      return;
    }

    setEditLoading(true);
    try {
      const roleId = editForm.roleId ? Number(editForm.roleId) : null;
      const res = await updateUser(editUserId, {
        email,
        first_name: editForm.first_name.trim() || null,
        last_name: editForm.last_name.trim() || null,
        roleId,
      });

      const selectedRole = roleId ? roles.find((r) => r.id === roleId) : undefined;
      const updated: User = {
        ...res.user,
        roles: selectedRole ? [selectedRole] : [],
      };

      setData((prev) => prev.map((u) => (u.id === editUserId ? updated : u)));
      setEditOpen(false);
      toast.success("User updated.");
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Unable to update user.");
      toast.error(e instanceof Error ? e.message : "Unable to update user.");
    } finally {
      setEditLoading(false);
    }
  };

  const openRemoveDialog = (userId: number) => {
    setRemoveUserId(userId);
    setRemoveOpen(true);
  };

  const closeRemoveDialog = () => setRemoveOpen(false);

  const confirmRemove = async () => {
    if (!removeUserId) return;
    setRemoveLoading(true);
    try {
      await deleteUser(removeUserId);
      setData((prev) => prev.filter((u) => u.id !== removeUserId));
      setRemoveOpen(false);
      toast.success("User removed.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Unable to remove user.");
    } finally {
      setRemoveLoading(false);
    }
  };

  const submitAddUser = async () => {
    setAddError(null);

    const email = newUser.email.trim();
    if (!email) {
      setAddError("Email is required.");
      return;
    }

    setAddLoading(true);
    try {
      const roleId = newUser.roleId ? Number(newUser.roleId) : null;
      const res = await createUser({
        email,
        first_name: newUser.first_name.trim() || null,
        last_name: newUser.last_name.trim() || null,
        roleId,
      });

      const selectedRole = roleId ? roles.find((r) => r.id === roleId) : undefined;
      const created: User = {
        ...res.user,
        roles: selectedRole ? [selectedRole] : [],
      };

      setData((prev) => [created, ...prev]);
      toast.success("User created.");
    } catch (e) {
      setAddError(e instanceof Error ? e.message : "Unable to create user.");
      toast.error(e instanceof Error ? e.message : "Unable to create user.");
    } finally {
      setAddLoading(false);
    }
  };

  const formatUpdatedAt = (value?: string | Date | null) => {
    if (!value) return "--";
    const date = typeof value === "string" ? new Date(value) : value;
    if (Number.isNaN(date.getTime())) return "--";
    return new Intl.DateTimeFormat("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusLabel = (user: User) => {
    if (user.status) return user.status;
    return user.is_deleted ? "Inactive" : "Active";
  };

  const getStatusStyle = (label: string) => {
    const normalized = label.toLowerCase();
    if (normalized === "inactive") return "bg-amber-50 text-amber-600";
    if (normalized === "suspended") return "bg-rose-50 text-rose-600";
    return "bg-emerald-50 text-emerald-600";
  };

  const getUserCode = (id: number) => `#USR${String(id).padStart(5, "0")}`;

  const getInitials = (user: User) => {
    const first = user.first_name?.trim() ?? "";
    const last = user.last_name?.trim() ?? "";
    if (first || last) {
      return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
    }
    return user.email.slice(0, 2).toUpperCase();
  };

  return (
    <section className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-medium text-neutral-500">Search</div>
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
              <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5">
                <path
                  d="M12.9 12.9L17 17M9 14a5 5 0 1 1 0-10 5 5 0 0 1 0 10Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                resetToFirstPage();
              }}
              placeholder="Search users..."
              className="h-[38px] w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm text-neutral-700 outline-none transition focus:border-neutral-300"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <div className="mb-1 text-xs font-medium text-neutral-500">Role</div>
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                resetToFirstPage();
              }}
              className="h-[38px] w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700"
            >
              <option value="all">Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <div className="mb-1 text-xs font-medium text-neutral-500">Status</div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value);
                resetToFirstPage();
              }}
              className="h-[38px] w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-700"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "Status" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            onClick={openAddDialog}
            className="h-[38px] rounded-lg bg-amber-500 px-4 text-sm font-semibold text-white transition hover:bg-amber-600"
          >
            Add User
          </button>
        </div>
      </div>

      <TableUI
        rows={filteredUsers}
        getRowKey={(user) => user.id}
        emptyState="No users found."
        containerClassName="mt-6 overflow-x-auto overflow-y-visible rounded-2xl border border-neutral-100"
        pagination={{
          page,
          pageSize,
          total,
          onPageChange: setPage,
          onPageSizeChange: (size) => {
            setPageSize(size);
            setPage(1);
          },
          mode: "client",
        }}
        columns={
          [
            {
              key: "email",
              header: (
                <>
                  Email <span aria-hidden>&#8597;</span>
                </>
              ),
              cellClassName: "px-4 py-5 font-semibold text-neutral-700",
              cell: (user) => user.email,
            },
            {
              key: "first_name",
              header: (
                <>
                  First Name <span aria-hidden>&#8597;</span>
                </>
              ),
              cellClassName: "px-4 py-5 text-neutral-700",
              cell: (user) => user.first_name ?? "--",
            },
            {
              key: "last_name",
              header: (
                <>
                  Last Name <span aria-hidden>&#8597;</span>
                </>
              ),
              cellClassName: "px-4 py-5 text-neutral-700",
              cell: (user) => user.last_name ?? "--",
            },
            {
              key: "role",
              header: (
                <>
                  Role <span aria-hidden>&#8597;</span>
                </>
              ),
              headerClassName: "px-4 py-3 text-left w-px whitespace-nowrap",
              cellClassName: "px-4 py-5 w-px whitespace-nowrap",
              cell: (user) => {
                const selectedRoleId = (user.roles ?? [])[0]?.id ?? null;
                return (
                  <RoleSelect
                    roles={roles}
                    selectedRoleId={selectedRoleId}
                    disabled={isPending}
                    onChange={(value) => handleChange(user.id, value ? [value] : [])}
                  />
                );
              },
            },
            {
              key: "updated",
              header: (
                <>
                  Last Updated <span aria-hidden>&#8597;</span>
                </>
              ),
              cellClassName: "px-4 py-5 text-neutral-600",
              cell: (user) => formatUpdatedAt(user.updated_at),
            },
            {
              key: "status",
              header: (
                <>
                  Status <span aria-hidden>&#8597;</span>
                </>
              ),
              cell: (user) => {
                const statusLabel = getStatusLabel(user);
                return (
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                      statusLabel,
                    )}`}
                  >
                    {statusLabel}
                  </span>
                );
              },
            },
            {
              key: "actions",
              header: "Actions",
              headerClassName: "px-4 py-3 text-left w-px whitespace-nowrap",
              cellClassName: "px-4 py-5 w-px whitespace-nowrap",
              cell: (user) => (
                <div className="flex items-center gap-2 text-neutral-500">
                  <button
                    type="button"
                    onClick={() => openEditDialog(user)}
                    className="h-9 w-9 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                  >
                    <span className="sr-only">Edit</span>
                    <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-5 w-5">
                      <path d="M4 20h4l10-10-4-4L4 16v4Z" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => openRemoveDialog(user.id)}
                    className="h-9 w-9 rounded-lg border border-neutral-200 hover:bg-neutral-50"
                  >
                    <span className="sr-only">Delete</span>
                    <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-5 w-5">
                      <path
                        d="M6 7h12M9 7V5h6v2M8 7l1 12h6l1-12"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>
              ),
            },
          ] satisfies TableColumn<User>[]
        }
      />

      <AddUserDialog
        open={addOpen}
        onClose={closeAddDialog}
        roles={roles}
        value={newUser}
        onChange={setNewUser}
        onSubmit={submitAddUser}
        loading={addLoading}
        error={addError}
        fieldSx={dialogFieldSx}
      />

      <EditUserDialog
        open={editOpen}
        onClose={closeEditDialog}
        roles={roles}
        value={editForm}
        onChange={setEditForm}
        onSubmit={submitEditUser}
        loading={editLoading}
        error={editError}
        fieldSx={dialogFieldSx}
      />

      <ConfirmDialog
        open={removeOpen}
        title="Remove user?"
        description="This action will remove the user from the list."
        confirmText="Remove"
        danger
        loading={removeLoading}
        onCancel={closeRemoveDialog}
        onConfirm={confirmRemove}
      />
    </section>
  );
}
