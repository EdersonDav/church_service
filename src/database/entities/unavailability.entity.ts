import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { User } from './users.entity';

@Entity(EntityEnum.UNAVAILABILITY)
@Unique(['user_id', 'date'])
export class Unavailability extends BaseEntity<Unavailability> {
  @Column({ type: 'timestamp' })
  date!: Date;

  @Column({ unique: true })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.unavailability)
  user!: User;
}