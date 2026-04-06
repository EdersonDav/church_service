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
exports.MinisterController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const ministers_1 = require("../../../../core/use-cases/ministers");
const user_1 = require("../../../../core/use-cases/user");
const church_1 = require("../../../../core/use-cases/church");
const user_church_1 = require("../../../../core/use-cases/user-church");
const minister_song_keys_1 = require("../../../../core/use-cases/minister-song-keys");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const dtos_1 = require("../../dtos");
let MinisterController = class MinisterController {
    constructor(createMinister, deleteMinister, getMinister, listMinistersByChurch, getMinisterByUserAndChurch, getUser, getChurch, getUserChurch, setMinisterSongKeys, listMinisterSongKeys) {
        this.createMinister = createMinister;
        this.deleteMinister = deleteMinister;
        this.getMinister = getMinister;
        this.listMinistersByChurch = listMinistersByChurch;
        this.getMinisterByUserAndChurch = getMinisterByUserAndChurch;
        this.getUser = getUser;
        this.getChurch = getChurch;
        this.getUserChurch = getUserChurch;
        this.setMinisterSongKeys = setMinisterSongKeys;
        this.listMinisterSongKeys = listMinisterSongKeys;
    }
    async ensureChurch(church_id) {
        const { data } = await this.getChurch.execute({ search_by: 'id', search_data: church_id });
        if (!data) {
            throw new common_1.NotFoundException('Church not found');
        }
    }
    async ensureMembership(user_id, church_id) {
        const { data } = await this.getUserChurch.execute({ user_id, church_id });
        if (!data) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
    async create(church_id, body) {
        await this.ensureChurch(church_id);
        const [{ data: user }, { data: userChurch }, { data: existingMinister }] = await Promise.all([
            this.getUser.execute({ search_by: 'id', search_data: body.user_id }),
            this.getUserChurch.execute({ user_id: body.user_id, church_id }),
            this.getMinisterByUserAndChurch.execute({ user_id: body.user_id, church_id }),
        ]);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!userChurch) {
            throw new common_1.BadRequestException('User is not a member of this church');
        }
        if (existingMinister) {
            throw new common_1.BadRequestException('User is already registered as minister');
        }
        const { data } = await this.createMinister.execute({
            church_id,
            user_id: body.user_id,
            name: body.name || user.name || 'Minister',
        });
        return (0, class_transformer_1.plainToClass)(dtos_1.CreateMinisterResponse, {
            ...data,
            user_name: user.name,
        }, {
            excludeExtraneousValues: true,
        });
    }
    async list(church_id, user) {
        await this.ensureChurch(church_id);
        await this.ensureMembership(user.id, church_id);
        const { data } = await this.listMinistersByChurch.execute({ church_id });
        const ministers = data.map((minister) => ({
            ...minister,
            user_name: minister.user?.name,
        }));
        return (0, class_transformer_1.plainToClass)(dtos_1.ListMinistersResponse, { ministers }, {
            excludeExtraneousValues: true,
        });
    }
    async delete(church_id, minister_id) {
        await this.ensureChurch(church_id);
        const { data: target } = await this.getMinister.execute({ minister_id });
        if (!target || target.church_id !== church_id) {
            throw new common_1.NotFoundException('Minister not found');
        }
        await this.deleteMinister.execute({ minister_id });
        return { message: 'Minister deleted successfully' };
    }
    async listMySongKeys(church_id, user) {
        await this.ensureChurch(church_id);
        await this.ensureMembership(user.id, church_id);
        const { data: minister } = await this.getMinisterByUserAndChurch.execute({
            user_id: user.id,
            church_id,
        });
        if (!minister) {
            throw new common_1.NotFoundException('User is not registered as minister in this church');
        }
        const { data } = await this.listMinisterSongKeys.execute({ minister_id: minister.id });
        const keys = data.map((item) => ({
            song_id: item.song_id,
            song_title: item.song?.title,
            song_default_key: item.song?.default_key,
            custom_key: item.custom_key,
        }));
        return (0, class_transformer_1.plainToClass)(dtos_1.MySongKeysResponse, { keys }, {
            excludeExtraneousValues: true,
        });
    }
    async setMySongKeys(church_id, body, user) {
        await this.ensureChurch(church_id);
        await this.ensureMembership(user.id, church_id);
        const { data: minister } = await this.getMinisterByUserAndChurch.execute({
            user_id: user.id,
            church_id,
        });
        if (!minister) {
            throw new common_1.NotFoundException('User is not registered as minister in this church');
        }
        const { data } = await this.setMinisterSongKeys.execute({
            church_id,
            minister_id: minister.id,
            items: body.items.map((item) => ({
                song_id: item.song_id,
                custom_key: item.custom_key,
            })),
        });
        const keys = data.map((item) => ({
            song_id: item.song_id,
            song_title: item.song?.title,
            song_default_key: item.song?.default_key,
            custom_key: item.custom_key,
        }));
        return (0, class_transformer_1.plainToClass)(dtos_1.MySongKeysResponse, { keys }, {
            excludeExtraneousValues: true,
        });
    }
};
exports.MinisterController = MinisterController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar usuário como ministro na igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiBody)({ type: dtos_1.CreateMinisterBody }),
    (0, swagger_1.ApiCreatedResponse)({ type: dtos_1.CreateMinisterResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateMinisterBody]),
    __metadata("design:returntype", Promise)
], MinisterController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar ministros da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.ListMinistersResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MinisterController.prototype, "list", null);
__decorate([
    (0, common_1.Delete)(':minister_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover ministro da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'minister_id', type: String }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                message: 'Minister deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('minister_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], MinisterController.prototype, "delete", null);
__decorate([
    (0, common_1.Get)('me/song-keys'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar meus tons personalizados' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.MySongKeysResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], MinisterController.prototype, "listMySongKeys", null);
__decorate([
    (0, common_1.Put)('me/song-keys'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Definir meus tons personalizados por música' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiBody)({ type: dtos_1.SetMySongKeysBody }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.MySongKeysResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.SetMySongKeysBody, Object]),
    __metadata("design:returntype", Promise)
], MinisterController.prototype, "setMySongKeys", null);
exports.MinisterController = MinisterController = __decorate([
    (0, swagger_1.ApiTags)('Ministros'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/ministers'),
    __metadata("design:paramtypes", [ministers_1.CreateMinister,
        ministers_1.DeleteMinister,
        ministers_1.GetMinister,
        ministers_1.ListMinistersByChurch,
        ministers_1.GetMinisterByUserAndChurch,
        user_1.GetUser,
        church_1.GetChurch,
        user_church_1.GetUserChurch,
        minister_song_keys_1.SetMinisterSongKeys,
        minister_song_keys_1.ListMinisterSongKeys])
], MinisterController);
//# sourceMappingURL=controller.js.map