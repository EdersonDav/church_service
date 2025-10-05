import { BaseRepository } from './base/base.repository';
import { Task } from '../../entities/tasks.entity';

export abstract class TaskRepository extends BaseRepository<Task> {
    abstract findById(task_id: string): Promise<Task | null>;
    abstract findBySector(sector_id: string): Promise<Task[]>;
    abstract update(task_id: string, data: Partial<Task>): Promise<Task | null>;
    abstract findByIds(task_ids: string[]): Promise<Task[]>;
}
