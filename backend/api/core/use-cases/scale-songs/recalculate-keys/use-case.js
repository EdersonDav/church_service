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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecalculateScaleSongKeys = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let RecalculateScaleSongKeys = class RecalculateScaleSongKeys {
    constructor(scaleRepository, scaleSongRepository, ministerRepository, ministerSongKeyRepository) {
        this.scaleRepository = scaleRepository;
        this.scaleSongRepository = scaleSongRepository;
        this.ministerRepository = ministerRepository;
        this.ministerSongKeyRepository = ministerSongKeyRepository;
    }
    async execute(input) {
        const scale = await this.scaleRepository.findById(input.scale_id);
        if (!scale || !scale.sector?.church_id) {
            return { data: [] };
        }
        const rows = await this.scaleSongRepository.findByScale(input.scale_id);
        if (!rows.length) {
            return { data: rows };
        }
        const minister = await this.resolveMinister(scale.sector.church_id, scale, rows);
        const customKeyMap = await this.getCustomKeysMap(minister?.id, rows.map((row) => row.song_id));
        await Promise.all(rows.map(async (row) => {
            const default_key = row.song?.default_key ?? row.key;
            const key = customKeyMap.get(row.song_id) ?? default_key;
            const minister_id = minister?.id ?? null;
            if (row.key === key && row.minister_id === minister_id) {
                return;
            }
            await this.scaleSongRepository.update(row.id, {
                key,
                minister_id,
            });
        }));
        const data = await this.scaleSongRepository.findByScale(input.scale_id);
        return { data };
    }
    async resolveMinister(church_id, scale, rows) {
        const participantUserIds = Array.from(new Set((scale.participants || []).map((item) => item.user_id)));
        if (!participantUserIds.length) {
            return null;
        }
        const candidates = await this.ministerRepository.findByChurchAndUsers(church_id, participantUserIds);
        const storedMinisterIds = Array.from(new Set(rows.map((row) => row.minister_id).filter(Boolean)));
        if (storedMinisterIds.length === 1) {
            const current = candidates.find((candidate) => candidate.id === storedMinisterIds[0]);
            if (current) {
                return current;
            }
        }
        if (candidates.length === 1) {
            return candidates[0];
        }
        return null;
    }
    async getCustomKeysMap(minister_id, song_ids) {
        if (!minister_id || !song_ids.length) {
            return new Map();
        }
        const uniqueSongIds = Array.from(new Set(song_ids));
        const items = await this.ministerSongKeyRepository.listByMinisterAndSongs(minister_id, uniqueSongIds);
        return new Map(items.map((item) => [item.song_id, item.custom_key]));
    }
};
exports.RecalculateScaleSongKeys = RecalculateScaleSongKeys;
exports.RecalculateScaleSongKeys = RecalculateScaleSongKeys = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.ScaleRepository,
        interfaces_1.ScaleSongRepository,
        interfaces_1.MinisterRepository,
        interfaces_1.MinisterSongKeyRepository])
], RecalculateScaleSongKeys);
//# sourceMappingURL=use-case.js.map