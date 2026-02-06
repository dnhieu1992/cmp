"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import type { User } from "@/types/users";
import type { Role } from "@/types/roles";
import { updateUserRoles } from "@/services/users.client";

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
      width: Math.max(256, rect.width),
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
        className="flex h-10 w-56 items-center justify-between rounded-lg border border-neutral-200 bg-white px-3 text-left text-sm text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:opacity-60"
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

  const statusOptions = ["all", "active", "inactive", "suspended"];

  const handleChange = (userId: number, roleIds: number[]) => {
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
      await updateUserRoles(userId, roleIds);
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
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const visibleUsers = useMemo(
    () => filteredUsers.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [filteredUsers, currentPage, pageSize],
  );

  const from = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

  const pageItems = useMemo(() => {
    const items: number[] = [];
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (let i = start; i <= end; i += 1) items.push(i);
    return items;
  }, [currentPage, totalPages]);

  const resetToFirstPage = () => setPage(1);

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
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[220px]">
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
            className="h-12 w-full rounded-full border border-neutral-200 bg-neutral-50 pl-12 pr-4 text-sm text-neutral-700 outline-none transition focus:border-neutral-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-neutral-500">Filter By:</span>
          <select
            value={roleFilter}
            onChange={(event) => {
              setRoleFilter(event.target.value);
              resetToFirstPage();
            }}
            className="h-11 min-w-[140px] rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-700"
          >
            <option value="all">Role</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              resetToFirstPage();
            }}
            className="h-11 min-w-[140px] rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-700"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status === "all" ? "Status" : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              resetToFirstPage();
            }}
            className="h-11 min-w-[70px] rounded-full border border-neutral-200 bg-white px-4 text-sm text-neutral-700"
          >
            {[8, 16, 24].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <button className="h-11 rounded-full bg-amber-500 px-6 text-sm font-semibold text-white transition hover:bg-amber-600">
            Add User
          </button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto overflow-y-visible rounded-2xl border border-neutral-100">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-neutral-50 text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-3 text-left">ID &#8597;</th>
              <th className="px-4 py-3 text-left">User &#8597;</th>
              <th className="px-4 py-3 text-left">Role &#8597;</th>
              <th className="px-4 py-3 text-left">Last Updated &#8597;</th>
              <th className="px-4 py-3 text-left">Status &#8597;</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-neutral-700">
            {visibleUsers.map((user) => {
              const selectedRoleId = (user.roles ?? [])[0]?.id ?? null;
              const fullName =
                user.first_name || user.last_name
                  ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                  : "Unnamed";
              const statusLabel = getStatusLabel(user);

              return (
                <tr key={user.id} className="border-t border-neutral-100">
                  <td className="px-4 py-4 font-semibold text-neutral-600">
                    {getUserCode(user.id)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-200 text-sm font-semibold text-neutral-700">
                        {getInitials(user)}
                      </div>
                      <div>
                        <div className="font-semibold">{fullName}</div>
                        <div className="text-xs text-neutral-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <RoleSelect
                      roles={roles}
                      selectedRoleId={selectedRoleId}
                      disabled={isPending}
                      onChange={(value) => handleChange(user.id, value ? [value] : [])}
                    />
                  </td>
                  <td className="px-4 py-4 text-neutral-600">{formatUpdatedAt(user.updated_at)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                        statusLabel,
                      )}`}
                    >
                      {statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 text-neutral-500">
                      <button className="h-9 w-9 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <span className="sr-only">View</span>
                        <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-5 w-5">
                          <path
                            d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                      <button className="h-9 w-9 rounded-lg border border-neutral-200 hover:bg-neutral-50">
                        <span className="sr-only">Edit</span>
                        <svg viewBox="0 0 24 24" fill="none" className="mx-auto h-5 w-5">
                          <path
                            d="M4 20h4l10-10-4-4L4 16v4Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path d="M14 6l4 4" stroke="currentColor" strokeWidth="1.5" />
                        </svg>
                      </button>
                      <button className="h-9 w-9 rounded-lg border border-neutral-200 hover:bg-neutral-50">
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
                  </td>
                </tr>
              );
            })}

            {visibleUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-sm text-neutral-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-500">
        <div>
          Showing {from} to {to} of {total} users
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 disabled:opacity-50"
          >
            <span className="sr-only">Previous page</span>
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {pageItems.map((p) => {
            const active = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={
                  active
                    ? "h-9 w-9 rounded-lg bg-indigo-600 text-xs font-semibold text-white"
                    : "h-9 w-9 rounded-lg border border-neutral-200 bg-white text-xs font-semibold text-neutral-700 hover:bg-neutral-50"
                }
              >
                {p}
              </button>
            );
          })}

          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            className="grid h-9 w-9 place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 disabled:opacity-50"
          >
            <span className="sr-only">Next page</span>
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
