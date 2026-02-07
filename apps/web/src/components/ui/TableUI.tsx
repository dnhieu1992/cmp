"use client";

import type { ReactNode } from "react";
import { useMemo } from "react";

export type TableColumn<Row> = {
  key: string;
  header: ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  cell: (row: Row) => ReactNode;
};

export type TableUIProps<Row> = {
  columns: TableColumn<Row>[];
  rows: Row[];
  getRowKey: (row: Row) => string | number;
  emptyState?: ReactNode;
  containerClassName?: string;
  tableClassName?: string;
  headClassName?: string;
  rowClassName?: string;
  pagination?: {
    page: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (pageSize: number) => void;
    pageSizeOptions?: number[];
    total?: number;
    mode?: "client" | "server";
    footerClassName?: string;
    label?: (info: { from: number; to: number; total: number }) => ReactNode;
  };
};

export default function TableUI<Row>({
  columns,
  rows,
  getRowKey,
  emptyState,
  containerClassName,
  tableClassName,
  headClassName,
  rowClassName,
  pagination,
}: TableUIProps<Row>) {
  const total = pagination?.total ?? rows.length;
  const totalPages = pagination ? Math.max(1, Math.ceil(total / pagination.pageSize)) : 1;
  const currentPage = pagination ? Math.min(pagination.page, totalPages) : 1;
  const pageSizeOptions = pagination?.pageSizeOptions ?? [5, 10, 20, 50];

  const visibleRows = useMemo(() => {
    if (!pagination) return rows;
    if ((pagination.mode ?? "client") === "server") return rows;

    const start = (currentPage - 1) * pagination.pageSize;
    const end = currentPage * pagination.pageSize;
    return rows.slice(start, end);
  }, [rows, pagination, currentPage]);

  const from = pagination ? (total === 0 ? 0 : (currentPage - 1) * pagination.pageSize + 1) : 0;
  const to = pagination
    ? total === 0
      ? 0
      : Math.min(currentPage * pagination.pageSize, total)
    : 0;

  const pageItems = useMemo(() => {
    if (!pagination) return [];
    const items: number[] = [];
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    for (let i = start; i <= end; i += 1) items.push(i);
    return items;
  }, [pagination, currentPage, totalPages]);

  return (
    <div>
      <div
        className={
          containerClassName ??
          "overflow-x-auto overflow-y-visible rounded-2xl border border-neutral-100"
        }
      >
        <table className={tableClassName ?? "w-full border-collapse text-sm"}>
          <thead className={headClassName ?? "bg-neutral-50 text-xs uppercase text-neutral-500"}>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.headerClassName ?? "px-4 py-3 text-left"}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-neutral-700">
            {visibleRows.map((row) => (
              <tr key={getRowKey(row)} className={rowClassName ?? "border-t border-neutral-100"}>
                {columns.map((col) => (
                  <td key={col.key} className={col.cellClassName ?? "px-4 py-5"}>
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))}

            {visibleRows.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="py-10 text-center text-sm text-neutral-500">
                  {emptyState ?? "No data found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div
          className={
            pagination.footerClassName ??
            "mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-neutral-500"
          }
        >
          <div>
            {pagination.label
              ? pagination.label({ from, to, total })
              : `Showing ${from} to ${to} of ${total}`}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500">Rows</span>
              <select
                value={pagination.pageSize}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  pagination.onPageSizeChange(next);
                  pagination.onPageChange(1);
                }}
                className="h-[38px] rounded-lg border border-neutral-200 bg-white px-3 text-sm font-semibold text-neutral-700"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => pagination.onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
                className="grid h-[38px] w-[38px] place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 disabled:opacity-50"
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
                    onClick={() => pagination.onPageChange(p)}
                    className={
                      active
                        ? "h-[38px] w-[38px] rounded-lg bg-indigo-600 text-sm font-semibold text-white"
                        : "h-[38px] w-[38px] rounded-lg border border-neutral-200 bg-white text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                    }
                  >
                    {p}
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => pagination.onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="grid h-[38px] w-[38px] place-items-center rounded-lg border border-neutral-200 bg-white text-neutral-600 disabled:opacity-50"
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
        </div>
      )}
    </div>
  );
}
