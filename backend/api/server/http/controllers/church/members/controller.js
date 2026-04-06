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
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const user_church_1 = require("../../../../../core/use-cases/user-church");
const user_1 = require("../../../../../core/use-cases/user");
const dtos_1 = require("../../../dtos");
const guards_1 = require("../../../../../core/guards");
const enums_1 = require("../../../../../enums");
const user_sector_1 = require("../../../../../core/use-cases/user-sector");
let MembersController = class MembersController {
    constructor(createUserChurch, getUser, getNotVerifiedUser, getUserChurchMembers, getUserChurch, deleteUserChurch, deleteUserSectorsByChurch) {
        this.createUserChurch = createUserChurch;
        this.getUser = getUser;
        this.getNotVerifiedUser = getNotVerifiedUser;
        this.getUserChurchMembers = getUserChurchMembers;
        this.getUserChurch = getUserChurch;
        this.deleteUserChurch = deleteUserChurch;
        this.deleteUserSectorsByChurch = deleteUserSectorsByChurch;
    }
    async addMember(body, church_id) {
        const { data: member } = await this.getUser.execute({ search_data: body.member_id, search_by: 'id' });
        if (!member || !member.email) {
            throw new common_1.BadRequestException('Invalid Member');
        }
        const { data: notVerifiedUser } = await this.getNotVerifiedUser.execute({ email: member.email });
        if (notVerifiedUser) {
            throw new common_1.BadRequestException('Member is not verified');
        }
        await this.createUserChurch.execute({
            church_id: church_id,
            user_id: body.member_id,
            role: enums_1.ChurchRoleEnum.VOLUNTARY
        });
        return { message: 'Member added successfully' };
    }
    async getMembers(church_id) {
        const { data: members } = await this.getUserChurchMembers.execute({ church_id });
        if (!members) {
            throw new common_1.BadRequestException('No members found for this church');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.ResponseMembersDTO, {
            church: members.church,
            members: members.members
        });
    }
    async makeAdmin(church_id, member_id) {
        const { data: member } = await this.getUser.execute({ search_data: member_id, search_by: 'id' });
        if (!member || !member.email) {
            throw new common_1.BadRequestException('Invalid Member');
        }
        const { data: isMember } = await this.getUserChurch.execute({ church_id, user_id: member_id });
        if (!isMember) {
            throw new common_1.BadRequestException('Invalid Member');
        }
        await this.createUserChurch.execute({
            church_id: church_id,
            user_id: member_id,
            role: enums_1.ChurchRoleEnum.ADMIN
        });
        return { message: 'Member promoted to admin successfully' };
    }
    async removeMember(church_id, member_id) {
        const { data: isMember } = await this.getUserChurch.execute({ church_id, user_id: member_id });
        if (!isMember) {
            throw new common_1.BadRequestException('Member is not part of this church');
        }
        await Promise.all([
            this.deleteUserChurch.execute({ church_id, user_id: member_id }),
            this.deleteUserSectorsByChurch.execute({ church_id, user_id: member_id }),
        ]);
        return { message: 'Member removed successfully' };
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Adicionar um membro à igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.BodyMemberDTO,
        description: 'Identificador do membro que será vinculado à igreja',
        examples: {
            default: {
                summary: 'Vincular membro existente',
                value: {
                    member_id: '9dd66e36-9a45-4fcf-8e83-291bdfe7c1b8',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Membro adicionado com sucesso',
        schema: {
            example: {
                message: 'Member added successfully',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)('church_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.BodyMemberDTO, String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "addMember", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar membros cadastrados na igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Lista de membros retornada com sucesso',
        schema: {
            example: {
                church: {
                    id: 'e8c7a0b9-7a0c-4f1d-8a3e-5f3c1e6b3a1f',
                    name: 'Igreja Vida em Cristo',
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "getMembers", null);
__decorate([
    (0, common_1.Post)('make_admin/:member_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Promover um membro ao papel de administrador' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'member_id', description: 'Identificador do membro', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Membro promovido com sucesso',
        schema: {
            example: {
                message: 'Member promoted to admin successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('member_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "makeAdmin", null);
__decorate([
    (0, common_1.Delete)(':member_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover um membro da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', description: 'Identificador da igreja', type: String }),
    (0, swagger_1.ApiParam)({ name: 'member_id', description: 'Identificador do membro', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Membro removido com sucesso',
        schema: {
            example: {
                message: 'Member removed successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('member_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MembersController.prototype, "removeMember", null);
exports.MembersController = MembersController = __decorate([
    (0, swagger_1.ApiTags)('Membros da Igreja'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/members'),
    __metadata("design:paramtypes", [user_church_1.CreateUserChurch,
        user_1.GetUser,
        user_1.GetNotVerifiedUser,
        user_church_1.GetUserChurchMembers,
        user_church_1.GetUserChurch,
        user_church_1.DeleteUserChurch,
        user_sector_1.DeleteUserSectorsByChurch])
], MembersController);
//# sourceMappingURL=controller.js.map