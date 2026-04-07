import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository, UserTaskRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';
import { Output } from './output';

@Injectable()
export class SetUserTasks {
    constructor(
        private readonly userTaskRepository: UserTaskRepository,
        private readonly taskRepository: TaskRepository,
    ) { }

    async execute({ user_id, task_ids }: Input): Promise<Output> {
        const uniqueTaskIds = Array.from(new Set(task_ids));

        const tasks = await this.taskRepository.findByIds(uniqueTaskIds);

        if (uniqueTaskIds.length !== tasks.length) {
            throw new NotFoundException('One or more tasks were not found');
        }

        const currentRelations = await this.userTaskRepository.findByUser(user_id);

        const currentTaskMap = new Map(currentRelations.map((relation) => [relation.task_id, relation]));

        const removals = currentRelations.filter((relation) => !uniqueTaskIds.includes(relation.task_id));

        await Promise.all(removals.map((relation) => this.userTaskRepository.delete(relation.id)));

        const creations = uniqueTaskIds.filter((task_id) => !currentTaskMap.has(task_id));

        await Promise.all(creations.map((task_id) => this.userTaskRepository.save({ user_id, task_id })));

        const updatedRelations = await this.userTaskRepository.findByUser(user_id);

        const orderedTasks = uniqueTaskIds.length
            ? uniqueTaskIds.map((task_id) => {
                const relation = updatedRelations.find((item) => item.task_id === task_id);
                return relation?.task;
            }).filter((task): task is NonNullable<typeof task> => !!task)
            : [];

        // When the client sends duplicated task ids we already removed duplicates but
        // we still want to make sure the response is deterministic.
        const fallbackTasks = orderedTasks.length ? orderedTasks : updatedRelations.map((relation) => relation.task).filter(Boolean);

        return { data: fallbackTasks };
    }
}
