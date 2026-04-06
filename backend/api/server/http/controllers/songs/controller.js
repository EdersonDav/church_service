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
exports.SongController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const songs_1 = require("../../../../core/use-cases/songs");
const church_1 = require("../../../../core/use-cases/church");
const user_church_1 = require("../../../../core/use-cases/user-church");
const guards_1 = require("../../../../core/guards");
const common_2 = require("../../../../common");
const dtos_1 = require("../../dtos");
let SongController = class SongController {
    constructor(createSong, listSongsByChurch, getSong, updateSong, deleteSong, getChurch, getUserChurch) {
        this.createSong = createSong;
        this.listSongsByChurch = listSongsByChurch;
        this.getSong = getSong;
        this.updateSong = updateSong;
        this.deleteSong = deleteSong;
        this.getChurch = getChurch;
        this.getUserChurch = getUserChurch;
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
    async ensureSongInChurch(song_id, church_id) {
        const { data } = await this.getSong.execute({ song_id });
        if (!data || data.church_id !== church_id) {
            throw new common_1.NotFoundException('Song not found');
        }
        return data;
    }
    async create(church_id, body) {
        await this.ensureChurch(church_id);
        const { data } = await this.createSong.execute({
            church_id,
            title: body.title,
            default_key: body.default_key,
        });
        return (0, class_transformer_1.plainToClass)(dtos_1.CreateSongResponse, data, {
            excludeExtraneousValues: true,
        });
    }
    async list(church_id, user) {
        await this.ensureChurch(church_id);
        await this.ensureMembership(user.id, church_id);
        const { data } = await this.listSongsByChurch.execute({ church_id });
        return (0, class_transformer_1.plainToClass)(dtos_1.ListSongsResponse, { songs: data }, {
            excludeExtraneousValues: true,
        });
    }
    async get(church_id, song_id, user) {
        await this.ensureChurch(church_id);
        await this.ensureMembership(user.id, church_id);
        const song = await this.ensureSongInChurch(song_id, church_id);
        return (0, class_transformer_1.plainToClass)(dtos_1.GetSongResponse, { song }, {
            excludeExtraneousValues: true,
        });
    }
    async update(church_id, song_id, body) {
        await this.ensureChurch(church_id);
        await this.ensureSongInChurch(song_id, church_id);
        if (!body.title && !body.default_key) {
            throw new common_1.BadRequestException('No changes provided');
        }
        const { data } = await this.updateSong.execute({
            song_id,
            song_data: {
                title: body.title,
                default_key: body.default_key,
            },
        });
        if (!data) {
            throw new common_1.NotFoundException('Song not found');
        }
        return (0, class_transformer_1.plainToClass)(dtos_1.UpdateSongResponse, data, {
            excludeExtraneousValues: true,
        });
    }
    async delete(church_id, song_id) {
        await this.ensureChurch(church_id);
        await this.ensureSongInChurch(song_id, church_id);
        await this.deleteSong.execute({ song_id });
        return { message: 'Song deleted successfully' };
    }
};
exports.SongController = SongController;
__decorate([
    (0, common_1.Post)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Criar música da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiBody)({ type: dtos_1.CreateSongBody }),
    (0, swagger_1.ApiCreatedResponse)({ type: dtos_1.CreateSongResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dtos_1.CreateSongBody]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar músicas da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.ListSongsResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "list", null);
__decorate([
    (0, common_1.Get)(':song_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Buscar música por id' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'song_id', type: String }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.GetSongResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('song_id')),
    __param(2, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "get", null);
__decorate([
    (0, common_1.Patch)(':song_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar música da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'song_id', type: String }),
    (0, swagger_1.ApiBody)({ type: dtos_1.UpdateSongBody }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.UpdateSongResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('song_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, dtos_1.UpdateSongBody]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':song_id'),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.ChurchRoleGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Remover música da igreja' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'song_id', type: String }),
    (0, swagger_1.ApiOkResponse)({
        schema: {
            example: {
                message: 'Song deleted successfully',
            },
        },
    }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('song_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SongController.prototype, "delete", null);
exports.SongController = SongController = __decorate([
    (0, swagger_1.ApiTags)('Músicas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/songs'),
    __metadata("design:paramtypes", [songs_1.CreateSong,
        songs_1.ListSongsByChurch,
        songs_1.GetSong,
        songs_1.UpdateSong,
        songs_1.DeleteSong,
        church_1.GetChurch,
        user_church_1.GetUserChurch])
], SongController);
//# sourceMappingURL=controller.js.map