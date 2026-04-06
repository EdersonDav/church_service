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
exports.SectorMembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_sector_1 = require("../../../../../core/use-cases/user-sector");
const user_1 = require("../../../../../core/use-cases/user");
const dtos_1 = require("../../../dtos");
const guards_1 = require("../../../../../core/guards");
const enums_1 = require("../../../../../enums");
const user_church_1 = require("../../../../../core/use-cases/user-church");
const get_1 = require("../../../../../core/use-cases/sectors/get");
let SectorMembersController = class SectorMembersController {
    constructor(createUserSector, getUser, getNotVerifiedUser, getUserSector, getUserSectorMembers, deleteUserSector, getUserChurch, getSector) {
        this.createUserSector = createUserSector;
        this.getUser = getUser;
        this.getNotVerifiedUser = getNotVerifiedUser;
        this.getUserSector = getUserSector;
        this.getUserSectorMembers = getUserSectorMembers;
        this.deleteUserSector = deleteUserSector;
        this.getUserChurch = getUserChurch;
        this.getSector = getSector;
    }
    async ensureSectorBelongsToChurch(church_id, sector_id) {
        const { data: sector } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });
        if (!sector) {
            throw new common_1.BadRequestException('Sector not found');
        }
        if (sector.church?.id && sector.church.id !== church_id) {
            throw new common_1.BadRequestException('Sector does not belong to this church');
        }
    }
    async ensureValidChurchMember(church_id, member_id) {
        const { data: member } = await this.getUser.execute({ search_data: member_id, search_by: 'id' });
        if (!member || !member.email) {
            throw new common_1.BadRequestException('Invalid Member');
        }
        const { data: notVerifiedUser } = await this.getNotVerifiedUser.execute({ email: member.email });
        if (notVerifiedUser) {
            throw new common_1.BadRequestException('Member is not verified');
        }
        const { data: churchMember } = await this.getUserChurch.execute({ church_id, user_id: member_id });
        if (!churchMember) {
            throw new common_1.BadRequestException('Member is not part of this church');
        }
    }
    async addMember(body, church_id, sector_id) {
        await this.ensureSectorBelongsToChurch(church_id, sector_id);
        await this.ensureValidChurchMember(church_id, body.member_id);
        await this.createUserSector.execute({
            sector_id,
            user_id: body.member_id,
            role: enums_1.SectorRoleEnum.MEMBER,
        });
        return { message: 'Member added to sector successfully' };
    }
    async getMembers(church_id, sector_id) {
        await this.ensureSectorBelongsToChurch(church_id, sector_id);
        const { data: sector } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });
        if (!sector) {
            throw new common_1.BadRequestException('Sector not found');
        }
        const { data: members } = await this.getUserSectorMembers.execute({ sector_id });
        return (0, class_transformer_1.plainToClass)(dtos_1.ResponseSectorMembersDTO, {
            sector,
            members: members?.members ?? [],
        });
    }
    async updateMemberRole(church_id, sector_id, member_id, body) {
        await this.ensureSectorBelongsToChurch(church_id, sector_id);
        await this.ensureValidChurchMember(church_id, member_id);
        await this.createUserSector.execute({
            sector_id,
            user_id: member_id,
            role: body.role,
        });
        return { message: 'Member role updated successfully' };
    }
    async removeMember(church_id, sector_id, member_id) {
        await this.ensureSectorBelongsToChurch(church_id, sector_id);
        const { data: relation } = await this.getUserSector.execute({ user_id: member_id, sector_id });
        if (!relation) {
            throw new common_1.BadRequestException('Member is not part of this sector');
        }
        await this.deleteUserSector.execute({ user_id: member_id, sector_id });
        return { message: 'Member removed from sector successfully' };
    }
};
exports.SectorMembersController = SectorMembersController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar um membro ao setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.BodyMemberDTO,
        description: 'Identificador do membro que será vinculado ao setor',
        examples: {
            default: {
                summary: 'Vincular membro existente ao setor',
                value: {
                    member_id: '9dd66e36-9a45-4fcf-8e83-291bdfe7c1b8',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Membro adicionado ao setor com sucesso',
        schema: {
            example: {
                message: 'Member added to sector successfully',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('church_id')),
    __param(2, (0, common_1.Param)('sector_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BodyMemberDTO, String, String]),
    __metadata("design:returntype", Promise)
], SectorMembersController.prototype, "addMember", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar membros cadastrados no setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de membros do setor retornada com sucesso',
        schema: {
            example: {
                sector: {
                    id: 'a7b5d4c2-6f8e-4b3a-9d2c-1e0f5a6b7c8d',
                    name: 'Ministério de Louvor',
                },
                members: [
                    {
                        id: '9dd66e36-9a45-4fcf-8e83-291bdfe7c1b8',
                        name: 'João Silva',
                        email: 'joao.silva@example.com',
                        is_verified: true,
                    },
                ],
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SectorMembersController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Patch)(':member_id/role'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Definir papel de um membro no setor (admin ou membro)' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'member_id', description: 'Identificador do membro', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.UpdateSectorMemberRoleBody,
        description: 'Novo papel do membro dentro do setor',
        examples: {
            default: {
                summary: 'Promover para admin do setor',
                value: {
                    role: 'ADMIN',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Papel do membro atualizado com sucesso',
        schema: {
            example: {
                message: 'Member role updated successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('member_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, dtos_1.UpdateSectorMemberRoleBody]),
    __metadata("design:returntype", Promise)
], SectorMembersController.prototype, "updateMemberRole", null);
__decorate([
    (0, common_1.Delete)(':member_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover um membro do setor' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', description: 'Identificador do setor', type: String }),
    (0, swagger_1.ApiParam)({ name: 'member_id', description: 'Identificador do membro', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Membro removido do setor com sucesso',
        schema: {
            example: {
                message: 'Member removed from sector successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('member_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], SectorMembersController.prototype, "removeMember", null);
exports.SectorMembersController = SectorMembersController = __decorate([
    (0, swagger_1.ApiTags)('Membros do Setor'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/sectors/:sector_id/members'),
    __metadata("design:paramtypes", [user_sector_1.CreateUserSector,
        user_1.GetUser,
        user_1.GetNotVerifiedUser,
        user_sector_1.GetUserSector,
        user_sector_1.GetUserSectorMembers,
        user_sector_1.DeleteUserSector,
        user_church_1.GetUserChurch,
        get_1.GetSector])
], SectorMembersController);
//# sourceMappingURL=controller.js.map