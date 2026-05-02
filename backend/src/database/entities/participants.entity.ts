import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Scale } from './scales.entity';
import { User } from './users.entity';
import { Task } from './tasks.entity';

@Entity(EntityEnum.PARTICIPANTS)
@Unique(['scale_id', 'user_id'])
export class Participant extends BaseEntity {
  @Column({ type: 'uuid', nullable: true })
  task_id?: string | null;

  @ManyToOne(() => Task, (task) => task.participants, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'task_id' })
  task?: Task | null;

  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  scale_id!: string;

  @ManyToOne(() => Scale, (scale) => scale.participants, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scale_id' })
  scale!: Scale;

}
