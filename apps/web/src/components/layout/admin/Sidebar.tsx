import Link from "next/link";

const items = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/users", label: "Users" },
  { href: "/dashboard/roles", label: "Roles" },
  { href: "/dashboard/posts", label: "Posts" },
];

export default function Sidebar() {
  return (
    <nav className="rounded-xl border bg-white p-4">
      <div className="mb-3 text-xs font-semibold uppercase text-neutral-500">Management</div>
      <ul className="space-y-2">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="block rounded-lg px-3 py-2 text-sm hover:bg-neutral-100">
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
