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
exports.SectorController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const dtos_1 = require("../../dtos");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const enums_1 = require("../../../../enums");
const sectors_1 = require("../../../../core/use-cases/sectors");
const user_sector_1 = require("../../../../core/use-cases/user-sector");
const get_1 = require("../../../../core/use-cases/church/get");
const user_church_1 = require("../../../../core/use-cases/user-church");
let SectorController = class SectorController {
    constructor(createSector, createUserSector, getUserSector, deleteSector, updateSector, getChurch, listSectorsByChurch, getUserChurch) {
        this.createSector = createSector;
        this.createUserSector = createUserSector;
        this.getUserSector = getUserSector;
        this.deleteSector = deleteSector;
        this.updateSector = updateSector;
        this.getChurch = getChurch;
        this.listSectorsByChurch = listSectorsByChurch;
        this.getUserChurch = getUserChurch;
    }
    async create(body, user, church_id) {
        if (!body.name) {
            throw new common_1.BadRequestException('Name is necessary');
        }
        const church = await this.getChurch.execute({ search_by: 'id', search_data: church_id });
        if (!church.data) {
            throw new common_1.NotFoundException('Church not found');
        }
        const { data } = await this.createSector.execute({
            name: body.name,
            church: church.data,
        });
        if (!data.name || !data.id) {
            throw new common_1.BadRequestException('Error creating church');
        }
        try {
            await this.createUserSector.execute({
                sector_id: data.id,
                user_id: user.id,
                role: enums_1.SectorRoleEnum.ADMIN
            });
            return (0, class_transformer_1.plainToClass)(dtos_1.CreateSectorResponseData, data, {
                excludeExtraneousValues: true
            });
        }
        catch (error) {
            console.error('Error creating sector:', error);
            await this.deleteSector.execute({
                sector_id: data.id,
            });
            throw new common_1.BadRequestException('Error creating sector');
        }
    }
    async list(church_id, user) {
        const { data: church } = await this.getChurch.execute({ search_by: 'id', search_data: church_id });
        if (!church) {
            throw new common_1.NotFoundException('Church not found');
        }
        const { data: userChurch } = await this.getUserChurch.execute({ church_id, user_id: user.id });
        if (!userChurch) {
            throw new common_1.ForbiddenException('Access denied');
        }
        const { data } = await this.listSectorsByChurch.execute({ church_id });
        return (0, class_transformer_1.plainToClass)(dtos_1.ListSectorsResponse, { sectors: data }, {
            excludeExtraneousValues: true
        });
    }
    async get(sector_id, user) {
        const { data } = await this.getUserSector.execute({
            user_id: user.id,
            sector_id
        });
        if (!data) {
            throw new common_1.NotFoundException('Church not found');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.GetSectorUserResponse, data, {
            excludeExtraneousValues: true
        });
    }
    async delete(sector_id) {
        await this.deleteSector.execute({
            sector_id
        });
        return { message: 'Sector deleted successfully' };
    }
    async update(sector_id, body) {
        if (!body.name) {
            throw new common_1.BadRequestException('Name is necessary');
        }
        const { data } = await this.updateSector.execute({
            sector_id,
            sector_data: body
        });
        if (!data?.id) {
            throw new common_1.BadRequestException('Error updating sector');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.UpdateSectorResponseData, data, {
            excludeExtraneousValues: true
        });
    }
};
exports.SectorController = SectorController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar um novo setor na igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.CreateSectorBody,
        description: 'Dados para criação do setor',
        examples: {
            default: {
                summary: 'Setor de música',
                value: {
                    name: 'Ministério de Louvor',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Setor criado com sucesso',
        schema: {
            example: {
                id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
                name: 'Ministério de Louvor',
                church_id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                created_at: '2024-05-11T12:00:00.000Z',
                updated_at: '2024-05-11T12:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __param(2, (0, common_1.Param)('church_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CreateSectorBody, Object, String]),
    __metadata("design:returntype", Promise)
], SectorController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar setores de uma igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Setores listados com sucesso',
        schema: {
            example: {
                sectors: [
                    {
                        id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
                        name: 'Ministério de Louvor',
                        created_at: '2024-05-11T12:00:00.000Z',
                        updated_at: '2024-05-11T12:00:00.000Z',
                    }
                ]
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SectorController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':sector_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Consultar dados do setor vinculado ao usuário' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String, required: false }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Setor encontrado com sucesso',
        schema: {
            example: {
                id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
                name: 'Ministério de Louvor',
                role: 'ADMIN',
            },
        },
    }),
    __param(0, (0, common_1.Param)('sector_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SectorController.prototype, "get", null);
__decorate([
    (0, common_1.Delete)(':sector_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover um setor' }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Setor removido com sucesso',
        schema: {
            example: {
                message: 'Sector deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('sector_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SectorController.prototype, "delete", null);
__decorate([
    (0, common_1.Patch)(':sector_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar informações de um setor' }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.UpdateSectorBody,
        description: 'Campos que podem ser atualizados',
        examples: {
            default: {
                summary: 'Atualização do nome',
                value: {
                    name: 'Ministério de Louvor Jovem',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Setor atualizado com sucesso',
        schema: {
            example: {
                id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
                name: 'Ministério de Louvor Jovem',
                church_id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                created_at: '2024-05-11T12:00:00.000Z',
                updated_at: '2024-06-01T10:00:00.000Z',
            },
        },
    }),
    __param(0, (0, common_1.Param)('sector_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.UpdateSectorBody]),
    __metadata("design:returntype", Promise)
], SectorController.prototype, "update", null);
exports.SectorController = SectorController = __decorate([
    (0, swagger_1.ApiTags)('Setores'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)(':church_id/sectors'),
    __metadata("design:paramtypes", [sectors_1.CreateSector,
        user_sector_1.CreateUserSector,
        user_sector_1.GetUserSector,
        sectors_1.DeleteSector,
        sectors_1.UpdateSector,
        get_1.GetChurch,
        sectors_1.ListSectorsByChurch,
        user_church_1.GetUserChurch])
], SectorController);
//# sourceMappingURL=controller.js.map