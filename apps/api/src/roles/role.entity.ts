import { Column, Entity, OneToMany } from 'typeorm';
import { UserRole } from './user_role.entity';
import { BaseEntity } from '../database/base.entity';

@Entity({ name: 'role' })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', length: 120, unique: true })
  name!: string;

  @OneToMany(() => UserRole, (ur) => ur.role)
  userRoles!: UserRole[];
}
