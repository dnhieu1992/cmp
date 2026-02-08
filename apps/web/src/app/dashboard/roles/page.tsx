import { fetchRoles } from "@/services/roles";
import RolesTable from "@/features/roles/RolesTable";
import { fetchPermissions } from "@/services/permissions";

export default async function RolePage() {
  const [roles, permissions] = await Promise.all([fetchRoles(), fetchPermissions()]);

  return (
    <section className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Roles</h1>
        <span className="text-sm text-neutral-500">{roles.length} roles</span>
      </div>

      <RolesTable roles={roles} permissions={permissions} />
    </section>
  );
}
