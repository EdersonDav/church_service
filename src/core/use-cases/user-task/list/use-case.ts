import { Injectable } from '@nestjs/common';
import { UserTaskRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class ListUserTasks {
    constructor(
        private readonly userTaskRepository: UserTaskRepository,
    ) { }

    async execute({ user_id }: Input): Promise<Output> {
        const relations = await this.userTaskRepository.findByUser(user_id);
        const tasks = relations.map((relation) => relation.task).filter((task): task is NonNullable<typeof task> => !!task);
        return { data: tasks };
    }
}
