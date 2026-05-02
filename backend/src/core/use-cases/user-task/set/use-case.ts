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

    async execute({ user_id, task_ids, sector_id }: Input): Promise<Output> {
        const uniqueTaskIds = Array.from(new Set(task_ids));

        const tasks = await this.taskRepository.findByIds(uniqueTaskIds);

        if (uniqueTaskIds.length !== tasks.length) {
            throw new NotFoundException('One or more tasks were not found');
        }

        if (sector_id && tasks.some((task) => task.sector_id !== sector_id)) {
            throw new NotFoundException('One or more tasks were not found in this sector');
        }

        const currentRelations = await this.userTaskRepository.findByUser(user_id);
        const editableRelations = sector_id
            ? currentRelations.filter((relation) => relation.task?.sector_id === sector_id)
            : currentRelations;

        const currentTaskMap = new Map(editableRelations.map((relation) => [relation.task_id, relation]));

        const removals = editableRelations.filter((relation) => !uniqueTaskIds.includes(relation.task_id));

        await Promise.all(removals.map((relation) => this.userTaskRepository.delete(relation.id)));

        const creations = uniqueTaskIds.filter((task_id) => !currentTaskMap.has(task_id));

        await Promise.all(creations.map((task_id) => this.userTaskRepository.save({ user_id, task_id })));

        const updatedRelations = await this.userTaskRepository.findByUser(user_id);
        const responseRelations = sector_id
            ? updatedRelations.filter((relation) => relation.task?.sector_id === sector_id)
            : updatedRelations;

        const orderedTasks = uniqueTaskIds.length
            ? uniqueTaskIds.map((task_id) => {
                const relation = responseRelations.find((item) => item.task_id === task_id);
                return relation?.task;
            }).filter((task): task is NonNullable<typeof task> => !!task)
            : [];

        // When the client sends duplicated task ids we already removed duplicates but
        // we still want to make sure the response is deterministic.
        const fallbackTasks = orderedTasks.length ? orderedTasks : responseRelations.map((relation) => relation.task).filter(Boolean);

        return { data: fallbackTasks };
    }
}
