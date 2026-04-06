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
exports.ScaleController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const scales_1 = require("../../../../core/use-cases/scales");
const sectors_1 = require("../../../../core/use-cases/sectors");
const user_sector_1 = require("../../../../core/use-cases/user-sector");
const user_church_1 = require("../../../../core/use-cases/user-church");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const scales_2 = require("../../dtos/scales");
let ScaleController = class ScaleController {
    constructor(createScale, updateScale, deleteScale, getScale, listScalesBySector, setScaleParticipants, getSector, getUserSector, getUserChurch) {
        this.createScale = createScale;
        this.updateScale = updateScale;
        this.deleteScale = deleteScale;
        this.getScale = getScale;
        this.listScalesBySector = listScalesBySector;
        this.setScaleParticipants = setScaleParticipants;
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
    toScaleDto(scale) {
        const participants = (scale.participants || []).map((participant) => ({
            user_id: participant.user_id,
            task_id: participant.task_id,
            user_name: participant.user?.name,
            task_name: participant.task?.name,
        }));
        return (0, class_transformer_1.plainToClass)(scales_2.ScaleDto, { ...scale, participants }, {
            excludeExtraneousValues: true,
        });
    }
    async create(church_id, sector_id, body) {
        await this.ensureSector(church_id, sector_id);
        const date = new Date(body.date);
        if (Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        const { data } = await this.createScale.execute({ sector_id, date });
        const { data: scale } = await this.getScale.execute({ scale_id: data.id });
        return this.toScaleDto(scale || { ...data, participants: [] });
    }
    async list(church_id, sector_id, user) {
        await this.ensureSector(church_id, sector_id);
        await this.ensureMembership(user.id, church_id, sector_id);
        const { data } = await this.listScalesBySector.execute({ sector_id });
        const scales = data.map((scale) => this.toScaleDto(scale));
        return (0, class_transformer_1.plainToClass)(scales_2.ListScalesResponse, { scales }, {
            excludeExtraneousValues: true,
        });
    }
    async get(church_id, sector_id, scale_id, user) {
        await this.ensureSector(church_id, sector_id);
        await this.ensureMembership(user.id, church_id, sector_id);
        const { data } = await this.getScale.execute({ scale_id });
        if (!data || data.sector_id !== sector_id) {
            throw new common_1.BadRequestException('Scale not found');
        }
        return (0, class_transformer_1.plainToClass)(scales_2.GetScaleResponse, { scale: this.toScaleDto(data) }, {
            excludeExtraneousValues: true,
        });
    }
    async update(church_id, sector_id, scale_id, body) {
        await this.ensureSector(church_id, sector_id);
        const date = body.date ? new Date(body.date) : undefined;
        if (date && Number.isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date');
        }
        await this.updateScale.execute({ scale_id, sector_id, date });
        const { data: fullScale } = await this.getScale.execute({ scale_id });
        if (!fullScale) {
            throw new common_1.BadRequestException('Scale not found');
        }
        return this.toScaleDto(fullScale);
    }
    async setParticipants(church_id, sector_id, scale_id, body) {
        await this.ensureSector(church_id, sector_id);
        await this.setScaleParticipants.execute({
            scale_id,
            sector_id,
            participants: body.participants,
        });
        const { data } = await this.getScale.execute({ scale_id });
        if (!data) {
            throw new common_1.BadRequestException('Scale not found');
        }
        return this.toScaleDto(data);
    }
    async delete(church_id, sector_id, scale_id) {
        await this.ensureSector(church_id, sector_id);
        const { data } = await this.getScale.execute({ scale_id });
        if (!data || data.sector_id !== sector_id) {
            throw new common_1.BadRequestException('Scale not found');
        }
        await this.deleteScale.execute({ scale_id });
        return { message: 'Scale deleted successfully' };
    }
};
exports.ScaleController = ScaleController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar uma escala para um setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiBody)({
        type: scales_2.CreateScaleBody,
        description: 'Data da escala em formato ISO 8601',
        examples: {
            default: {
                summary: 'Escala para o culto de domingo',
                value: {
                    date: '2024-06-21T18:00:00.000Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiCreatedResponse)({
        description: 'Escala criada com sucesso',
        schema: {
            example: {
                id: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d',
                date: '2024-06-21T18:00:00.000Z',
                sector_id: '5a971fe8-d468-44df-a582-4adb44d6fda0',
                participants: [],
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, scales_2.CreateScaleBody]),
    __metadata("design:returntype", Promise)
], ScaleController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar escalas cadastradas para um setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Escalas recuperadas com sucesso',
        schema: {
            example: {
                scales: [
                    {
                        id: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d',
                        date: '2024-06-21T18:00:00.000Z',
                        sector_id: '5a971fe8-d468-44df-a582-4adb44d6fda0',
                        participants: [
                            {
                                user_id: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da',
                                user_name: 'Jane Doe',
                                task_id: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39',
                                task_name: 'Ministro de Louvor',
                            },
                        ],
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
], ScaleController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':scale_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar detalhes de uma escala específica' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'scale_id', description: 'Identificador da escala', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Escala encontrada com sucesso',
        schema: {
            example: {
                scale: {
                    id: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d',
                    date: '2024-06-21T18:00:00.000Z',
                    sector_id: '5a971fe8-d468-44df-a582-4adb44d6fda0',
                    participants: [
                        {
                            user_id: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da',
                            user_name: 'Jane Doe',
                            task_id: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39',
                            task_name: 'Ministro de Louvor',
                        },
                    ],
                },
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('scale_id')),
    __param(3, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScaleController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':scale_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar a data de uma escala' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'scale_id', description: 'Identificador da escala', type: String }),
    (0, swagger_1.ApiBody)({
        type: scales_2.UpdateScaleBody,
        description: 'Campos disponíveis para atualização da escala',
        examples: {
            default: {
                summary: 'Alteração de data',
                value: {
                    date: '2024-06-28T18:00:00.000Z',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Escala atualizada com sucesso',
        schema: {
            example: {
                id: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d',
                date: '2024-06-28T18:00:00.000Z',
                sector_id: '5a971fe8-d468-44df-a582-4adb44d6fda0',
                participants: [
                    {
                        user_id: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da',
                        user_name: 'Jane Doe',
                        task_id: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39',
                        task_name: 'Ministro de Louvor',
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('scale_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, scales_2.UpdateScaleBody]),
    __metadata("design:returntype", Promise)
], ScaleController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':scale_id/participants'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Definir os participantes de uma escala' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'scale_id', description: 'Identificador da escala', type: String }),
    (0, swagger_1.ApiBody)({
        type: scales_2.SetScaleParticipantsBody,
        description: 'Participantes atribuídos à escala',
        examples: {
            default: {
                summary: 'Participantes atribuídos',
                value: {
                    participants: [
                        {
                            user_id: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da',
                            task_id: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39',
                        },
                        {
                            user_id: '8d0f741a-91f4-49eb-9b43-33f1257a3e70',
                            task_id: '5f2f96e4-4cde-4f0a-9f5b-7df48608bbaa',
                        },
                    ],
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Participantes atualizados com sucesso',
        schema: {
            example: {
                id: '0e91d1cd-a808-4ef3-9618-1f049d9fe76d',
                date: '2024-06-21T18:00:00.000Z',
                sector_id: '5a971fe8-d468-44df-a582-4adb44d6fda0',
                participants: [
                    {
                        user_id: 'f61c1fb0-316c-4a7a-a3b0-1bd19d8da3da',
                        user_name: 'Jane Doe',
                        task_id: '2bf6c88b-1b0e-4a9f-b5f7-68bb5f4f5e39',
                        task_name: 'Ministro de Louvor',
                    },
                    {
                        user_id: '8d0f741a-91f4-49eb-9b43-33f1257a3e70',
                        user_name: 'John Smith',
                        task_id: '5f2f96e4-4cde-4f0a-9f5b-7df48608bbaa',
                        task_name: 'Baterista',
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('scale_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, scales_2.SetScaleParticipantsBody]),
    __metadata("design:returntype", Promise)
], ScaleController.prototype, "setParticipants", null);
__decorate([
    (0, common_1.Delete)(':scale_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover uma escala' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'scale_id', description: 'Identificador da escala', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Escala removida com sucesso',
        schema: {
            example: {
                message: 'Scale deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('scale_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], ScaleController.prototype, "delete", null);
exports.ScaleController = ScaleController = __decorate([
    (0, swagger_1.ApiTags)('Escalas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/sectors/:sector_id/scales'),
    __metadata("design:paramtypes", [scales_1.CreateScale,
        scales_1.UpdateScale,
        scales_1.DeleteScale,
        scales_1.GetScale,
        scales_1.ListScalesBySector,
        scales_1.SetScaleParticipants,
        sectors_1.GetSector,
        user_sector_1.GetUserSector,
        user_church_1.GetUserChurch])
], ScaleController);
//# sourceMappingURL=controller.js.map