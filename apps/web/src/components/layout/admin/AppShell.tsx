import { ReactNode } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <Topbar />
      <div className="grid w-full grid-cols-12 gap-6 px-6 py-6">
        <aside className="col-span-12 lg:col-span-3">
          <Sidebar />
        </aside>
        <main className="col-span-12 lg:col-span-9">{children}</main>
      </div>
    </div>
  );
}
