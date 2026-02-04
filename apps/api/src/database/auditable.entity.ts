import { Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from '../users/user.entity';

export abstract class AuditableEntity extends BaseEntity {
  @Column({ name: 'created_by', nullable: true })
  created_by: number | null = null;

  @Column({ name: 'updated_by', nullable: true })
  updated_by: number | null = null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  created_by_user?: User | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  updated_by_user?: User | null;
}
