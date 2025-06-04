import { BaseRepository } from './base/base.repository';
import { Task } from '../../entities/tasks.entity';

export abstract class TaskRepository extends BaseRepository<Task> {
}
