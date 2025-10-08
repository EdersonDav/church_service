import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../../../database/repositories/interfaces';
import { removeNullUndefinedFields } from '../../../helpers';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class UpdateTask {
    constructor(
        private readonly taskRepository: TaskRepository,
    ) { }

    async execute({ task_id, task_data }: Input): Promise<Output> {
        const data = await this.taskRepository.update(task_id, removeNullUndefinedFields(task_data));
        return { data };
    }
}
