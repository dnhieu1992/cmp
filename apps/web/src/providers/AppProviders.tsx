"use client";

import ToastifyProvider from "@/providers/ToastifyProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastifyProvider />
    </>
  );
}
