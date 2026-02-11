import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../database/base.entity';
import { UserRole } from '../roles/entity/user_role.entity';
import { Session } from '../permission/entity/session.entity';

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

  @Column({ type: 'varchar', length: 255, nullable: true })
  refresh_token_hash?: string | null;

  @OneToMany(() => UserRole, (ur) => ur.user)
  userRoles!: UserRole[];

  @OneToMany(() => Session, (s) => s.user)
  sessions!: Session[];
}
