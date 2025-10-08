import { Task } from '../../../../database/entities';

export class Input {
    task_id!: string;
    task_data!: Partial<Pick<Task, 'name' | 'icon' | 'description'>>;
}
