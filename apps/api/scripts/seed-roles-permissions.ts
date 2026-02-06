import { AppDataSource } from '../src/database/data-source';
import { Role } from '../src/roles/entity/role.entity';
import { Permission } from '../src/permission/entity/permission.entity';
import { RolePermission } from '../src/permission/entity/role_permission.entity';

type RoleSeed = {
  name: string;
  permissions: string[];
};

const permissionsSeed = [
  { code: 'users.read', description: 'Read users' },
  { code: 'users.write', description: 'Create/update users' },
  { code: 'roles.read', description: 'Read roles' },
  { code: 'roles.write', description: 'Create/update roles' },
  { code: 'permissions.read', description: 'Read permissions' },
  { code: 'posts.read', description: 'Read posts' },
  { code: 'posts.write', description: 'Create/update posts' },
  { code: 'posts.publish', description: 'Publish posts' },
];

const rolesSeed: RoleSeed[] = [
  {
    name: 'admin',
    permissions: permissionsSeed.map((p) => p.code),
  },
  {
    name: 'editor',
    permissions: [
      'users.read',
      'roles.read',
      'permissions.read',
      'posts.read',
      'posts.write',
      'posts.publish',
    ],
  },
  {
    name: 'viewer',
    permissions: ['users.read', 'posts.read', 'roles.read', 'permissions.read'],
  },
];

async function seed() {
  await AppDataSource.initialize();
  const roleRepository = AppDataSource.getRepository(Role);
  const permissionRepository = AppDataSource.getRepository(Permission);
  const rolePermissionRepository = AppDataSource.getRepository(RolePermission);

  await permissionRepository.upsert(permissionsSeed, ['code']);
  await roleRepository.upsert(
    rolesSeed.map((r) => ({ name: r.name })),
    ['name'],
  );

  const permissions = await permissionRepository.find();
  const roles = await roleRepository.find();

  const permissionMap = new Map(permissions.map((p) => [p.code, p]));
  const roleMap = new Map(roles.map((r) => [r.name, r]));

  const existing = await rolePermissionRepository.find({
    relations: { role: true, permission: true },
  });
  const existingKey = new Set(
    existing.map((rp) => `${rp.role.name}:${rp.permission.code}`),
  );

  const toCreate: RolePermission[] = [];

  rolesSeed.forEach((roleSeed) => {
    const role = roleMap.get(roleSeed.name);
    if (!role) return;

    roleSeed.permissions.forEach((permCode) => {
      const permission = permissionMap.get(permCode);
      if (!permission) return;

      const key = `${role.name}:${permission.code}`;
      if (existingKey.has(key)) return;

      toCreate.push(
        rolePermissionRepository.create({
          role,
          permission,
        }),
      );
    });
  });

  if (toCreate.length) {
    await rolePermissionRepository.save(toCreate);
  }

  console.log(
    `Seeded roles: ${roles.length}, permissions: ${permissions.length}, role_permissions: ${toCreate.length}`,
  );
  await AppDataSource.destroy();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await AppDataSource.destroy();
  process.exit(1);
});
