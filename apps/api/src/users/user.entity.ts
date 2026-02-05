import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../database/base.entity';
import { UserRole } from '../roles/user_role.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  first_name?: string | null;

  @Column({ type: 'varchar', length: 120, nullable: true })
  last_name?: string | null;

  @Column({ length: 255 })
  password_hash!: string;

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles!: UserRole[];
}
