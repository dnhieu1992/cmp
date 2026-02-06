import { Column, Entity, OneToMany } from 'typeorm';
import { RolePermission } from './role_permission.entity';
import { BaseEntity } from '../../database/base.entity';

@Entity('permission')
export class Permission extends BaseEntity {
  @Column({ type: 'varchar', length: 120, unique: true })
  code!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description?: string | null;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  rolePermissions!: RolePermission[];
}
