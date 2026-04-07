import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListTasksBySector {
    constructor(
        private readonly taskRepository: TaskRepository,
    ) { }

    async execute({ sector_id }: Input): Promise<Output> {
        const data = await this.taskRepository.findBySector(sector_id);
        return { data };
    }
}
