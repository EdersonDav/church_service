import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class GetTask {
    constructor(
        private readonly taskRepository: TaskRepository,
    ) { }

    async execute({ task_id }: Input): Promise<Output> {
        const data = await this.taskRepository.findById(task_id);
        return { data };
    }
}
