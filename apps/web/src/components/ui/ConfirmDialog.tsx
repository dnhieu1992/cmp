"use client";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger,
  loading,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {description ? <p className="mt-1 text-sm text-neutral-600">{description}</p> : null}
      </DialogContent>
      <DialogActions>
        <div className="flex w-full items-center justify-end gap-3 px-2 pb-2">
          <button
            type="button"
            onClick={onCancel}
            className="h-[38px] rounded-full bg-slate-100 px-8 text-sm font-semibold text-slate-700 hover:bg-slate-200"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={!!loading}
            className={
              danger
                ? "h-[38px] rounded-full bg-rose-600 px-8 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60"
                : "h-[38px] rounded-full bg-indigo-600 px-8 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60"
            }
          >
            {loading ? "Working..." : confirmText}
          </button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
