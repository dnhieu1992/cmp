import { BaseEntity } from '../../database/base.entity';
import { User } from '../../users/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('session')
export class Session extends BaseEntity {
  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;

  @Column({ type: 'varchar', length: 255, unique: true })
  session_token!: string;

  @Column({ type: 'datetime' })
  expires_at!: Date;

  @Column({ type: 'varchar', length: 120, nullable: true })
  ip_address?: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  user_agent?: string | null;
}
