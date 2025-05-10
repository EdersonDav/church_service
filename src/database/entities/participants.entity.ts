import { Column, Entity, ManyToOne, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Scale } from './scales.entity';
import { User } from './users.entity';
import { Task } from './tasks.entity';

@Entity(EntityEnum.PARTICIPANTS)
@Unique(['scale_id', 'user_id', 'task_id'])
export class Participant extends BaseEntity {
  @Column()
  task_id!: string;

  @OneToOne(() => Task, (task) => task.participant)
  task!: Task;

  @Column({ unique: true })
  user_id!: string;

  @OneToOne(() => User, (user) => user.participant)
  user!: User;

  @Column({ unique: true })
  scale_id!: string;

  @ManyToOne(() => Scale, (scale) => scale.participants)
  scale!: Scale;

}
