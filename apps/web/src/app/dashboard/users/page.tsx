import UsersRoleTable from "@/features/users/UsersRoleTable";
import { fetchRoles } from "@/services/roles";
import { fetchUsers } from "@/services/users";

export default async function UserPage() {
  const [users, roles] = await Promise.all([fetchUsers(), fetchRoles()]);
  return <UsersRoleTable users={users} roles={roles} />;
}
