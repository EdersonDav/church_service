import { UUID } from 'crypto';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Generated
} from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @Generated('uuid')
  id!: UUID;

  @CreateDateColumn()
  created_at?: Date;

  @UpdateDateColumn()
  updated_at?: Date;
}
