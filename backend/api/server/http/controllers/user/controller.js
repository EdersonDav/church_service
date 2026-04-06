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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const create_1 = require("../../../../core/use-cases/verification-code/create");
const emails_1 = require("../../../../core/use-cases/emails");
const dtos_1 = require("../../dtos");
const unavailability_1 = require("../../dtos/unavailability");
const user_1 = require("../../../../core/use-cases/user");
const user_task_1 = require("../../../../core/use-cases/user-task");
const unavailability_2 = require("../../../../core/use-cases/unavailability");
const auth_guard_1 = require("../../../../core/guards/auth.guard");
const common_2 = require("../../../../common");
let UserController = class UserController {
    constructor(createUser, getUser, updateUser, createVerificationCode, deleteUser, sendUserAlreadyExists, sendVerifyCode, setUserTasks, listUserTasks, createUnavailability, deleteUnavailability, listUserUnavailability) {
        this.createUser = createUser;
        this.getUser = getUser;
        this.updateUser = updateUser;
        this.createVerificationCode = createVerificationCode;
        this.deleteUser = deleteUser;
        this.sendUserAlreadyExists = sendUserAlreadyExists;
        this.sendVerifyCode = sendVerifyCode;
        this.setUserTasks = setUserTasks;
        this.listUserTasks = listUserTasks;
        this.createUnavailability = createUnavailability;
        this.deleteUnavailability = deleteUnavailability;
        this.listUserUnavailability = listUserUnavailability;
    }
    async get(email) {
        const user = await this.getUser.execute({ search_by: 'email', search_data: email });
        if (!user?.data?.id) {
            return null;
        }
        return { data: user.data };
    }
    async create(body) {
        const { data: existingUser } = await this.getUser.execute({ search_by: 'email', search_data: body.email });
        if (existingUser?.id && existingUser.is_verified) {
            this.sendUserAlreadyExists.execute({
                email: body.email
            });
            return { message: 'Verify your email' };
        }
        const { data: userCreated } = await this.createUser.execute(body);
        if (!userCreated || !userCreated.email) {
            throw new Error('Error during user creation');
        }
        if (userCreated.is_verified) {
            return { message: 'User created' };
        }
        try {
            const { data: { code } } = await this.createVerificationCode.execute({
                user: userCreated,
            });
            if (!code) {
                throw new Error('Error creating verification code');
            }
            this.sendVerifyCode.execute({
                email: userCreated.email,
                code
            });
            return { message: 'Verify your email' };
        }
        catch (error) {
            console.log(error);
            await this.deleteUser.execute({ email: userCreated.email });
            throw new Error('Error sending verification code');
        }
    }
    async getTasks(id, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data } = await this.listUserTasks.execute({ user_id: id });
        return (0, class_transformer_1.plainToClass)(dtos_1.UserTasksResponse, { tasks: data }, {
            excludeExtraneousValues: true,
        });
    }
    async updateTasks(id, body, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data } = await this.setUserTasks.execute({
            user_id: id,
            task_ids: body.task_ids,
        });
        return (0, class_transformer_1.plainToClass)(dtos_1.UserTasksResponse, { tasks: data }, {
            excludeExtraneousValues: true,
        });
    }
    async listUnavailability(id, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data } = await this.listUserUnavailability.execute({ user_id: id });
        return (0, class_transformer_1.plainToClass)(unavailability_1.ListUnavailabilityResponse, { items: data }, {
            excludeExtraneousValues: true,
        });
    }
    async createUnavailabilityHandler(id, body, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const date = new Date(body.date);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        const { data } = await this.createUnavailability.execute({
            user_id: id,
            date,
        });
        return (0, class_transformer_1.plainToClass)(unavailability_1.UnavailabilityDto, data, {
            excludeExtraneousValues: true,
        });
    }
    async deleteUnavailabilityHandler(id, unavailability_id, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data } = await this.listUserUnavailability.execute({ user_id: id });
        const target = data.find((item) => item.id === unavailability_id);
        if (!target) {
            throw new common_1.BadRequestException('Unavailability not found');
        }
        await this.deleteUnavailability.execute({ unavailability_id });
        return { message: 'Unavailability removed' };
    }
    async update(id, dto, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data: userUpdated } = await this.updateUser.execute({
            update_by: 'id',
            user_data: {
                ...dto,
                id
            }
        });
        if (!userUpdated) {
            throw new Error('Error updating user');
        }
        return { data: userUpdated };
    }
    async delete(id, user) {
        if (user.id !== id) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data: currentUser } = await this.getUser.execute({ search_by: 'id', search_data: id });
        if (!currentUser?.email) {
            throw new common_1.BadRequestException('User not found');
        }
        await this.deleteUser.execute({ email: currentUser.email });
        return { message: 'User deleted successfully' };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Get)(':email'),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar usuário pelo e-mail' }),
    (0, swagger_1.ApiParam)({ name: 'email', description: 'E-mail do usuário', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuário recuperado com sucesso',
        schema: {
            example: {
                data: {
                    id: 'c7d1435a-2308-4a4c-9f36-3c0dca1b7f4d',
                    name: 'Maria Souza',
                    email: 'maria.souza@example.com',
                    birthday: '1990-05-12',
                    is_verified: true,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar um novo usuário' }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.CreateUserBody,
        description: 'Dados utilizados para cadastro do usuário',
        examples: {
            default: {
                summary: 'Cadastro com dados válidos',
                value: {
                    name: 'Maria Souza',
                    email: 'maria.souza@example.com',
                    password: 'Strong#Password1',
                    birthday: '1990-05-12',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Resultado do processo de cadastro',
        schema: {
            example: {
                message: 'Verify your email',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateUserBody]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id/tasks'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar tarefas vinculadas ao usuário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tarefas retornadas com sucesso',
        schema: {
            example: {
                tasks: [
                    {
                        id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                        name: 'Ministro de Louvor',
                        icon: 'https://cdn.example.com/icons/worship.png',
                        description: 'Responsável por conduzir o louvor',
                        sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getTasks", null);
__decorate([
    (0, common_1.Put)(':id/tasks'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Definir tarefas vinculadas ao usuário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.UpdateUserTasksBody,
        description: 'Lista de tarefas atribuídas ao usuário',
        examples: {
            default: {
                summary: 'Definição de tarefas',
                value: {
                    task_ids: [
                        '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                        '1c2d3e4f-5a6b-7c8d-9e0f-1234567890ab',
                    ],
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Tarefas atualizadas com sucesso',
        schema: {
            example: {
                tasks: [
                    {
                        id: '0b752e60-0f75-4314-b9f4-1f0d4a1f4f23',
                        name: 'Ministro de Louvor',
                        icon: 'https://cdn.example.com/icons/worship.png',
                        description: 'Responsável por conduzir o louvor',
                        sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
                    },
                    {
                        id: '1c2d3e4f-5a6b-7c8d-9e0f-1234567890ab',
                        name: 'Baterista',
                        sector_id: 'f8f1e6d8-9e58-4d0e-94dc-70f6e0a3b2f5',
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateUserTasksBody, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateTasks", null);
__decorate([
    (0, common_1.Get)(':id/unavailability'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Listar indisponibilidades cadastradas para o usuário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de indisponibilidades retornada com sucesso',
        schema: {
            example: {
                items: [
                    {
                        id: 'd51c7c49-03f1-4243-9b27-77c7c3d3dfd5',
                        date: '2024-07-01T00:00:00.000Z',
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "listUnavailability", null);
__decorate([
    (0, common_1.Post)(':id/unavailability'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar uma nova indisponibilidade para o usuário' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiBody)({
        type: unavailability_1.CreateUnavailabilityBody,
        description: 'Data da indisponibilidade em formato ISO 8601',
        examples: {
            default: {
                summary: 'Indisponibilidade para viajar',
                value: {
                    date: '2024-07-01T00:00:00.000Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Indisponibilidade criada com sucesso',
        schema: {
            example: {
                id: 'd51c7c49-03f1-4243-9b27-77c7c3d3dfd5',
                date: '2024-07-01T00:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, unavailability_1.CreateUnavailabilityBody, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createUnavailabilityHandler", null);
__decorate([
    (0, common_1.Delete)(':id/unavailability/:unavailability_id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma indisponibilidade cadastrada' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiParam)({ name: 'unavailability_id', description: 'Identificador da indisponibilidade', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Indisponibilidade removida com sucesso',
        schema: {
            example: {
                message: 'Unavailability removed',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('unavailability_id')),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUnavailabilityHandler", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar dados do usuário autenticado' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.UpdateUserBody,
        description: 'Campos permitidos para atualização',
        examples: {
            default: {
                summary: 'Atualização de nome e data de nascimento',
                value: {
                    name: 'Maria S. Oliveira',
                    birthday: '1991-03-20',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuário atualizado com sucesso',
        schema: {
            example: {
                data: {
                    id: 'c7d1435a-2308-4a4c-9f36-3c0dca1b7f4d',
                    name: 'Maria S. Oliveira',
                    email: 'maria.souza@example.com',
                    birthday: '1991-03-20',
                    is_verified: true,
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateUserBody, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir conta do usuário autenticado' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Identificador do usuário', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuário removido com sucesso',
        schema: {
            example: {
                message: 'User deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('Usuários'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_1.CreateUser,
        user_1.GetUser,
        user_1.UpdateUser,
        create_1.CreateVerificationCode,
        user_1.DeleteUser,
        emails_1.SendUserAlreadyExists,
        emails_1.SendVerifyCode,
        user_task_1.SetUserTasks,
        user_task_1.ListUserTasks,
        unavailability_2.CreateUnavailability,
        unavailability_2.DeleteUnavailability,
        unavailability_2.ListUserUnavailability])
], UserController);
//# sourceMappingURL=controller.js.map