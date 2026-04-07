import { BaseRepository } from './base/base.repository';
import { UserTask } from '../../entities';

export abstract class UserTaskRepository extends BaseRepository<UserTask> {
    abstract findByUser(user_id: string): Promise<UserTask[]>;
    abstract findByUserAndTask(user_id: string, task_id: string): Promise<UserTask | null>;
}
