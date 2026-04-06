"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetUserTasks = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let SetUserTasks = class SetUserTasks {
    constructor(userTaskRepository, taskRepository) {
        this.userTaskRepository = userTaskRepository;
        this.taskRepository = taskRepository;
    }
    async execute({ user_id, task_ids }) {
        const uniqueTaskIds = Array.from(new Set(task_ids));
        const tasks = await this.taskRepository.findByIds(uniqueTaskIds);
        if (uniqueTaskIds.length !== tasks.length) {
            throw new common_1.NotFoundException('One or more tasks were not found');
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
            }).filter((task) => !!task)
            : [];
        const fallbackTasks = orderedTasks.length ? orderedTasks : updatedRelations.map((relation) => relation.task).filter(Boolean);
        return { data: fallbackTasks };
    }
};
exports.SetUserTasks = SetUserTasks;
exports.SetUserTasks = SetUserTasks = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.UserTaskRepository,
        interfaces_1.TaskRepository])
], SetUserTasks);
//# sourceMappingURL=use-case.js.map