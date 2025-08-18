import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { ChurchRoleEnum, EntityEnum } from '../../enums';
import { User } from './users.entity';
import { Task } from './tasks.entity';

@Entity(EntityEnum.USER_TASK)
@Unique('user_task_unique', ['user', 'task'])
export class UserTask extends BaseEntity {
  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Task, (task) => task.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'task_id' })
  task!: Task;
}
