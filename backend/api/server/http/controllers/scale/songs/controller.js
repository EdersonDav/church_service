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
exports.ScaleSongController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const guards_1 = require("../../../../../core/guards");
const common_2 = require("../../../../../common");
const sectors_1 = require("../../../../../core/use-cases/sectors");
const scales_1 = require("../../../../../core/use-cases/scales");
const user_church_1 = require("../../../../../core/use-cases/user-church");
const user_sector_1 = require("../../../../../core/use-cases/user-sector");
const scale_songs_1 = require("../../../../../core/use-cases/scale-songs");
const dtos_1 = require("../../../dtos");
let ScaleSongController = class ScaleSongController {
    constructor(setScaleSongs, listScaleSongs, getSector, getScale, getUserChurch, getUserSector) {
        this.setScaleSongs = setScaleSongs;
        this.listScaleSongs = listScaleSongs;
        this.getSector = getSector;
        this.getScale = getScale;
        this.getUserChurch = getUserChurch;
        this.getUserSector = getUserSector;
    }
    async ensureSector(church_id, sector_id) {
        const { data } = await this.getSector.execute({ search_by: 'id', search_data: sector_id });
        if (!data || data.church?.id !== church_id) {
            throw new common_1.NotFoundException('Sector not found for this church');
        }
    }
    async ensureScale(church_id, sector_id, scale_id) {
        await this.ensureSector(church_id, sector_id);
        const { data } = await this.getScale.execute({ scale_id });
        if (!data || data.sector_id !== sector_id || data.sector?.church_id !== church_id) {
            throw new common_1.NotFoundException('Scale not found');
        }
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
    toDto(data) {
        return data.map((item) => ({
            id: item.id,
            song_id: item.song_id,
            song_title: item.song?.title,
            song_default_key: item.song?.default_key,
            key: item.key,
            minister_id: item.minister_id ?? null,
            minister_name: item.minister?.name ?? null,
        }));
    }
    async list(church_id, sector_id, scale_id, user) {
        await this.ensureScale(church_id, sector_id, scale_id);
        await this.ensureMembership(user.id, church_id, sector_id);
        const { data } = await this.listScaleSongs.execute({ scale_id });
        return (0, class_transformer_1.plainToClass)(dtos_1.ListScaleSongsResponse, { songs: this.toDto(data) }, {
            excludeExtraneousValues: true,
        });
    }
    async set(church_id, sector_id, scale_id, body) {
        await this.ensureScale(church_id, sector_id, scale_id);
        if (!Array.isArray(body.song_ids)) {
            throw new common_1.BadRequestException('song_ids must be an array');
        }
        const { data } = await this.setScaleSongs.execute({
            church_id,
            sector_id,
            scale_id,
            song_ids: body.song_ids,
            minister_id: body.minister_id,
        });
        return (0, class_transformer_1.plainToClass)(dtos_1.SetScaleSongsResponse, { songs: this.toDto(data) }, {
            excludeExtraneousValues: true,
        });
    }
};
exports.ScaleSongController = ScaleSongController;
__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Listar músicas da escala com tom aplicado' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'scale_id', type: String }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.ListScaleSongsResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('scale_id')),
    __param(3, (0, common_2.ReqUserDecorator)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ScaleSongController.prototype, "list", null);
__decorate([
    (0, common_1.Put)(''),
    (0, common_1.UseGuards)(guards_1.AuthGuard, guards_1.SectorGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Definir músicas da escala e aplicar tons automaticamente' }),
    (0, swagger_1.ApiParam)({ name: 'church_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'sector_id', type: String }),
    (0, swagger_1.ApiParam)({ name: 'scale_id', type: String }),
    (0, swagger_1.ApiBody)({ type: dtos_1.SetScaleSongsBody }),
    (0, swagger_1.ApiOkResponse)({ type: dtos_1.SetScaleSongsResponse }),
    __param(0, (0, common_1.Param)('church_id')),
    __param(1, (0, common_1.Param)('sector_id')),
    __param(2, (0, common_1.Param)('scale_id')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, dtos_1.SetScaleSongsBody]),
    __metadata("design:returntype", Promise)
], ScaleSongController.prototype, "set", null);
exports.ScaleSongController = ScaleSongController = __decorate([
    (0, swagger_1.ApiTags)('Músicas da Escala'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('churches/:church_id/sectors/:sector_id/scales/:scale_id/songs'),
    __metadata("design:paramtypes", [scale_songs_1.SetScaleSongs,
        scale_songs_1.ListScaleSongs,
        sectors_1.GetSector,
        scales_1.GetScale,
        user_church_1.GetUserChurch,
        user_sector_1.GetUserSector])
], ScaleSongController);
//# sourceMappingURL=controller.js.map