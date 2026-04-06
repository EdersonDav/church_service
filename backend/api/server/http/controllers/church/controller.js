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
exports.ChurchController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const church_1 = require("../../../../core/use-cases/church");
const user_church_1 = require("../../../../core/use-cases/user-church");
const dtos_1 = require("../../dtos");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const enums_1 = require("../../../../enums");
let ChurchController = class ChurchController {
    constructor(createChurch, createUserChurch, getUserChurch, deleteChurch, updateChurch, listChurches) {
        this.createChurch = createChurch;
        this.createUserChurch = createUserChurch;
        this.getUserChurch = getUserChurch;
        this.deleteChurch = deleteChurch;
        this.updateChurch = updateChurch;
        this.listChurches = listChurches;
    }
    async create(body, user) {
        if (!body.name) {
            throw new common_1.BadRequestException('Name is necessary');
        }
        const { data } = await this.createChurch.execute({
            name: body.name,
            user_id: user.id
        });
        if (!data.id) {
            throw new common_1.BadRequestException('Error creating church');
        }
        try {
            await this.createUserChurch.execute({
                church_id: data.id,
                user_id: user.id,
                role: enums_1.ChurchRoleEnum.ADMIN
            });
            return data;
        }
        catch (error) {
            console.error('Error creating church:', error);
            await this.deleteChurch.execute({
                church_id: data.id,
            });
            throw new common_1.BadRequestException('Error creating church');
        }
    }
    async list() {
        const { data } = await this.listChurches.execute();
        return (0, class_transformer_1.plainToClass)(dtos_1.ListChurchesResponse, { churches: data }, {
            excludeExtraneousValues: true
        });
    }
    async get(church_id, user) {
        const { data } = await this.getUserChurch.execute({
            user_id: user.id,
            church_id
        });
        if (!data) {
            throw new common_1.NotFoundException('Church not found');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.GetChurchUserResponse, data, {
            excludeExtraneousValues: true
        });
    }
    async delete(church_id) {
        await this.deleteChurch.execute({
            church_id
        });
        return { message: 'Church deleted successfully' };
    }
    async update(church_id, body) {
        if (!body.name) {
            throw new common_1.BadRequestException('Name is necessary');
        }
        const { data } = await this.updateChurch.execute({
            church_id,
            church_data: body
        });
        if (!data?.id) {
            throw new common_1.BadRequestException('Error updating church');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.UpdateChurchResponseData, data, {
            excludeExtraneousValues: true
        });
    }
};
exports.ChurchController = ChurchController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma nova igreja' }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.CreateChurchBody,
        description: 'Dados para criação da igreja',
        examples: {
            default: {
                summary: 'Igreja local',
                value: {
                    name: 'Igreja Vida em Cristo',
                    description: 'Comunidade localizada no centro da cidade',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Igreja criada com sucesso',
        schema: {
            example: {
                id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                name: 'Igreja Vida em Cristo',
                description: 'Comunidade localizada no centro da cidade',
                created_at: '2024-05-11T12:00:00.000Z',
                updated_at: '2024-05-11T12:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateChurchBody, Object]),
    __metadata("design:returntype", Promise)
], ChurchController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar igrejas cadastradas' }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de igrejas retornada com sucesso',
        schema: {
            example: {
                churches: [
                    {
                        id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                        name: 'Igreja Vida em Cristo',
                        description: 'Comunidade localizada no centro da cidade',
                        created_at: '2024-05-11T12:00:00.000Z',
                        updated_at: '2024-05-11T12:00:00.000Z',
                    },
                ],
            },
        },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChurchController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':church_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar dados da igreja vinculada ao usuário' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Dados da igreja retornados com sucesso',
        schema: {
            example: {
                id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                name: 'Igreja Vida em Cristo',
                description: 'Comunidade localizada no centro da cidade',
                created_at: '2024-05-11T12:00:00.000Z',
                updated_at: '2024-05-11T12:00:00.000Z',
                role: 'ADMIN',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ChurchController.prototype, "get", null);
__decorate([
    (0, common_1.Delete)(':church_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Excluir uma igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Igreja excluída com sucesso',
        schema: {
            example: {
                message: 'Church deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChurchController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':church_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar informações da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.UpdateChurchBody,
        description: 'Campos que podem ser atualizados',
        examples: {
            default: {
                summary: 'Alteração do nome',
                value: {
                    name: 'Igreja Vida em Cristo - Centro',
                    description: 'Comunidade localizada no centro da cidade',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Igreja atualizada com sucesso',
        schema: {
            example: {
                id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                name: 'Igreja Vida em Cristo - Centro',
                description: 'Comunidade localizada no centro da cidade',
                created_at: '2024-05-11T12:00:00.000Z',
                updated_at: '2024-06-01T10:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateChurchBody]),
    __metadata("design:returntype", Promise)
], ChurchController.prototype, "update", null);
exports.ChurchController = ChurchController = __decorate([
    (0, swagger_1.ApiTags)('Igrejas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches'),
    __metadata("design:paramtypes", [church_1.CreateChurch,
        user_church_1.CreateUserChurch,
        user_church_1.GetUserChurch,
        church_1.DeleteChurch,
        church_1.UpdateChurch,
        church_1.ListChurches])
], ChurchController);
//# sourceMappingURL=controller.js.map