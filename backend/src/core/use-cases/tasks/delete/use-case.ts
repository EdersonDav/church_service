import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteTask {
    constructor(
        private readonly taskRepository: TaskRepository,
    ) { }

    async execute({ task_id }: Input): Promise<void> {
        await this.taskRepository.delete(task_id);
    }
}
