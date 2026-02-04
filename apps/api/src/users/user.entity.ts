import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../database/base.entity';

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
}
