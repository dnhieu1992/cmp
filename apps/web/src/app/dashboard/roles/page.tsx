import { fetchRoles } from "@/services/roles";

export default async function RolePage() {
  const roles = await fetchRoles();

  return (
    <section className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Roles</h1>
        <span className="text-sm text-neutral-500">{roles.length} roles</span>
      </div>

      <div className="mt-4 divide-y">
        {roles.map((role) => (
          <div key={role.id} className="flex items-center justify-between py-3">
            <div className="text-sm font-medium">{role.name}</div>
            <div className="text-xs text-neutral-500">ID: {role.id}</div>
          </div>
        ))}

        {roles.length === 0 && (
          <div className="py-8 text-center text-sm text-neutral-500">No roles found.</div>
        )}
      </div>
    </section>
  );
}
