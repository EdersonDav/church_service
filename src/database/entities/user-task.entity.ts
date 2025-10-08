import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { ChurchRoleEnum, EntityEnum } from '../../enums';
import { User } from './users.entity';
import { Task } from './tasks.entity';

@Entity(EntityEnum.USER_TASK)
@Unique('user_task_unique', ['user', 'task'])
export class UserTask extends BaseEntity {
  @Column({ type: 'uuid' })
  user_id!: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  task_id!: string;

  @ManyToOne(() => Task, (task) => task.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
}
