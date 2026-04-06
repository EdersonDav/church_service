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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const tasks_1 = require("../../../../core/use-cases/tasks");
const sectors_1 = require("../../../../core/use-cases/sectors");
const user_sector_1 = require("../../../../core/use-cases/user-sector");
const user_church_1 = require("../../../../core/use-cases/user-church");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const tasks_2 = require("../../dtos/tasks");
let TaskController = class TaskController {
    constructor(createTask, listTasksBySector, getTask, updateTask, deleteTask, getSector, getUserSector, getUserChurch) {
        this.createTask = createTask;
        this.listTasksBySector = listTasksBySector;
        this.getTask = getTask;
        this.updateTask = updateTask;
        this.deleteTask = deleteTask;
        this.getSector = getSector;
        this.getUserSector = getUserSector;
        this.getUserChurch = getUserChurch;
    }
    async ensureSector(church_id, sector_id) {
        const { data } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });
        if (!data || data.church?.id !== church_id) {
            throw new common_1.BadRequestException('Sector not found for this church');
        }
        return data;
    }
    async ensureMembership(user_id, church_id, sector_id) {
        const [{ data: churchRelation }, { data: sectorRelation }] = await Promise.all([
            this.getUserChurch.execute({ user_id, church_id }),
            this.getUserSector.execute({ user_id, sector_id }),
        ]);
        if (!churchRelation && !sectorRelation) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
    async create(church_id, sector_id, body) {
        if (!body.name) {
            throw new common_1.BadRequestException('Name is necessary');
        }
        await this.ensureSector(church_id, sector_id);
        const { data } = await this.createTask.execute({ ...body, sector_id });
        return (0, class_transformer_1.plainToClass)(tasks_2.CreateTaskResponseData, data, {
            excludeExtraneousValues: true,
        });
    }
    async list(church_id, sector_id, user) {
        await this.ensureSector(church_id, sector_id);
        await this.ensureMembership(user.id, church_id, sector_id);
        const { data } = await this.listTasksBySector.execute({ sector_id });
        return (0, class_transformer_1.plainToClass)(tasks_2.ListTasksResponse, { tasks: data }, {
            excludeExtraneousValues: true,
        });
    }
    async get(church_id, sector_id, task_id, user) {
        await this.ensureSector(church_id, sector_id);
        await this.ensureMembership(user.id, church_id, sector_id);
        const { data } = await this.getTask.execute({ task_id });
        if (!data || data.sector_id !== sector_id) {
            throw new common_1.BadRequestException('Task not found in this sector');
        }
        return (0, class_transformer_1.plainToClass)(tasks_2.GetTaskResponse, { task: data }, {
            excludeExtraneousValues: true,
        });
    }
    async update(church_id, sector_id, task_id, body) {
        await this.ensureSector(church_id, sector_id);
        if (!body.name && !body.icon && !body.description) {
            throw new common_1.BadRequestException('No changes provided');
        }
        const { data: currentTask } = await this.getTask.execute({ task_id });
        if (!currentTask || currentTask.sector_id !== sector_id) {
            throw new common_1.BadRequestException('Task not found in this sector');
        }
        const { data } = await this.updateTask.execute({ task_id, task_data: body });
        if (!data) {
            throw new common_1.BadRequestException('Error updating task');
        }
        return (0, class_transformer_1.plainToClass)(tasks_2.UpdateTaskResponseData, data, {
            excludeExtraneousValues: true,
        });
    }
    async delete(church_id, sector_id, task_id) {
        await this.ensureSector(church_id, sector_id);
        const { data } = await this.getTask.execute({ task_id });
        if (!data || data.sector_id !== sector_id) {
            throw new common_1.BadRequestException('Task not found in this sector');
        }
        await this.deleteTask.execute({ task_id });
        return { message: 'Task deleted successfully' };
    }
};
exports.TaskController = TaskController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma tarefa para um setor específico' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiBody)({
        type: tasks_2.CreateTaskBody,
        description: 'Dados utilizados para criar uma nova tarefa',
        examples: {
            default: {
                summary: 'Tarefa de louvor',
                value: {
                    name: 'Ministro de Louvor',
                    icon: 'https://cdn.example.com/icons/worship.png',
                    description: 'Responsável por conduzir os momentos de louvor',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Tarefa criada com sucesso',
        schema: {
            example: {
                id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                name: 'Ministro de Louvor',
                icon: 'https://cdn.example.com/icons/worship.png',
                description: 'Responsável por conduzir os momentos de louvor',
                sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, tasks_2.CreateTaskBody]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas as tarefas de um setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de tarefas recuperada com sucesso',
        schema: {
            example: {
                tasks: [
                    {
                        id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                        name: 'Ministro de Louvor',
                        icon: 'https://cdn.example.com/icons/worship.png',
                        description: 'Responsável por conduzir os momentos de louvor',
                        sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':task_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar detalhes de uma tarefa específica' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'task_id', description: 'Identificador da tarefa', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tarefa encontrada com sucesso',
        schema: {
            example: {
                task: {
                    id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                    name: 'Ministro de Louvor',
                    icon: 'https://cdn.example.com/icons/worship.png',
                    description: 'Responsável por conduzir os momentos de louvor',
                    sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('task_id')),
    __param(3, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':task_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar os dados de uma tarefa' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'task_id', description: 'Identificador da tarefa', type: String }),
    (0, swagger_1.ApiBody)({
        type: tasks_2.UpdateTaskBody,
        description: 'Campos que podem ser atualizados na tarefa',
        examples: {
            default: {
                summary: 'Atualização parcial',
                value: {
                    name: 'Ministro auxiliar',
                    description: 'Auxilia o líder de louvor nas ministrações',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tarefa atualizada com sucesso',
        schema: {
            example: {
                id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                name: 'Ministro auxiliar',
                icon: 'https://cdn.example.com/icons/worship.png',
                description: 'Auxilia o líder de louvor nas ministrações',
                sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('task_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, tasks_2.UpdateTaskBody]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':task_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma tarefa de um setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'task_id', description: 'Identificador da tarefa', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tarefa removida com sucesso',
        schema: {
            example: {
                message: 'Task deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('task_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "delete", null);
exports.TaskController = TaskController = __decorate([
    (0, swagger_1.ApiTags)('Tarefas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/sectors/:sector_id/tasks'),
    __metadata("design:paramtypes", [tasks_1.CreateTask,
        tasks_1.ListTasksBySector,
        tasks_1.GetTask,
        tasks_1.UpdateTask,
        tasks_1.DeleteTask,
        sectors_1.GetSector,
        user_sector_1.GetUserSector,
        user_church_1.GetUserChurch])
], TaskController);
//# sourceMappingURL=controller.js.map