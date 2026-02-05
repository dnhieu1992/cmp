import { fetchUsers } from "@/services/users";

export default async function UserPage() {
  const users = await fetchUsers();

  return (
    <section className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Users</h1>
        <span className="text-sm text-neutral-500">{users.length} users</span>
      </div>

      <div className="mt-4 divide-y">
        {users.map((u) => (
          <div key={u.id} className="flex items-center justify-between py-3">
            <div>
              <div className="text-sm font-medium">
                {u.first_name || u.last_name
                  ? `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim()
                  : "Unnamed"}
              </div>
              <div className="text-xs text-neutral-500">{u.email}</div>
            </div>
            <div className="text-xs text-neutral-500">ID: {u.id}</div>
          </div>
        ))}

        {users.length === 0 && (
          <div className="py-8 text-center text-sm text-neutral-500">No users found.</div>
        )}
      </div>
    </section>
  );
}
