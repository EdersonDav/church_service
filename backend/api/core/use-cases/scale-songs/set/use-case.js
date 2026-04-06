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
exports.SetScaleSongs = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let SetScaleSongs = class SetScaleSongs {
    constructor(scaleRepository, scaleSongRepository, songRepository, ministerRepository, ministerSongKeyRepository) {
        this.scaleRepository = scaleRepository;
        this.scaleSongRepository = scaleSongRepository;
        this.songRepository = songRepository;
        this.ministerRepository = ministerRepository;
        this.ministerSongKeyRepository = ministerSongKeyRepository;
    }
    async execute(input) {
        const scale = await this.scaleRepository.findById(input.scale_id);
        if (!scale || scale.sector_id !== input.sector_id || scale.sector?.church_id !== input.church_id) {
            throw new common_1.NotFoundException('Scale not found');
        }
        const uniqueSongIds = Array.from(new Set(input.song_ids));
        const songs = await this.songRepository.findByIds(uniqueSongIds);
        if (songs.length !== uniqueSongIds.length) {
            throw new common_1.NotFoundException('One or more songs were not found');
        }
        for (const song of songs) {
            if (song.church_id !== input.church_id) {
                throw new common_1.BadRequestException('Song does not belong to this church');
            }
        }
        const minister = await this.resolveMinister({
            church_id: input.church_id,
            scale,
            preferred_minister_id: input.minister_id,
            strict: true,
        });
        const customKeysMap = await this.getCustomKeysMap(minister?.id, uniqueSongIds);
        const songsMap = new Map(songs.map((song) => [song.id, song]));
        const currentRows = await this.scaleSongRepository.findByScale(input.scale_id);
        const desiredSet = new Set(uniqueSongIds);
        const removals = currentRows.filter((row) => !desiredSet.has(row.song_id));
        await Promise.all(removals.map((row) => this.scaleSongRepository.delete(row.id)));
        for (const song_id of uniqueSongIds) {
            const song = songsMap.get(song_id);
            if (!song) {
                continue;
            }
            const key = customKeysMap.get(song_id) ?? song.default_key;
            const current = currentRows.find((row) => row.song_id === song_id);
            if (current) {
                await this.scaleSongRepository.update(current.id, {
                    key,
                    minister_id: minister?.id ?? null,
                });
                continue;
            }
            await this.scaleSongRepository.save({
                scale_id: input.scale_id,
                song_id,
                key,
                minister_id: minister?.id ?? null,
            });
        }
        const data = await this.scaleSongRepository.findByScale(input.scale_id);
        return {
            data,
            selected_minister: minister,
        };
    }
    async resolveMinister(input) {
        const participantUserIds = Array.from(new Set((input.scale.participants || []).map((item) => item.user_id)));
        if (!participantUserIds.length) {
            if (input.preferred_minister_id) {
                throw new common_1.BadRequestException('Minister is not scheduled on this scale');
            }
            return null;
        }
        const ministers = await this.ministerRepository.findByChurchAndUsers(input.church_id, participantUserIds);
        if (input.preferred_minister_id) {
            const selected = ministers.find((minister) => minister.id === input.preferred_minister_id);
            if (!selected) {
                throw new common_1.BadRequestException('Minister is not scheduled on this scale');
            }
            return selected;
        }
        if (ministers.length === 1) {
            return ministers[0];
        }
        if (input.strict && ministers.length > 1) {
            throw new common_1.BadRequestException('Multiple ministers scheduled. Provide minister_id');
        }
        return null;
    }
    async getCustomKeysMap(minister_id, song_ids) {
        if (!minister_id || !song_ids.length) {
            return new Map();
        }
        const items = await this.ministerSongKeyRepository.listByMinisterAndSongs(minister_id, song_ids);
        return new Map(items.map((item) => [item.song_id, item.custom_key]));
    }
};
exports.SetScaleSongs = SetScaleSongs;
exports.SetScaleSongs = SetScaleSongs = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.ScaleRepository,
        interfaces_1.ScaleSongRepository,
        interfaces_1.SongRepository,
        interfaces_1.MinisterRepository,
        interfaces_1.MinisterSongKeyRepository])
], SetScaleSongs);
//# sourceMappingURL=use-case.js.map