import { Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';
import { Role } from '../../roles/entity/role.entity';
import { Permission } from './permission.entity';

@Entity('role_permissions')
export class RolePermission extends BaseEntity {
  @ManyToOne(() => Role, (role) => role.rolePermissions)
  role!: Role;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions)
  permission!: Permission;
}
