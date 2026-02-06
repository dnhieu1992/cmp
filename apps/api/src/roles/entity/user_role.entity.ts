import { User } from '../../users/user.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Role } from './role.entity';
import { BaseEntity } from '../../database/base.entity';

@Entity('user_roles')
export class UserRole extends BaseEntity {
  @ManyToOne(() => User, (user) => user.userRoles)
  user!: User;

  @ManyToOne(() => Role, (role) => role.userRoles)
  role!: Role;
}
