import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { User } from './users.entity';

@Entity(EntityEnum.UNAVAILABILITY)
@Unique(['user_id', 'date'])
export class Unavailability extends BaseEntity {
  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.unavailability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}