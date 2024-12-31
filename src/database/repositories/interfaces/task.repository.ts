import { Task } from '../../entities/tasks.entity';

export abstract class TaskRepository {
  abstract save(task: Partial<Task>): Promise<Task>;
}
