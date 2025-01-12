import { Entity, ManyToOne, OneToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Scale } from './scales.entity';
import { User } from './users.entity';
import { Task } from './tasks.entity';

@Entity(EntityEnum.PARTICIPANTS)
@Unique(['scale_id', 'user_id', 'task_id'])
export class Participant extends BaseEntity<Participant> {
  @OneToOne(() => Task, (task) => task.participant)
  task!: Task;

  @OneToOne(() => User, (user) => user.participant)
  user!: User;

  @ManyToOne(() => Scale, (scale) => scale.participants)
  scale!: Scale;

}
