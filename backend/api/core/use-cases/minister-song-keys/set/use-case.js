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
exports.SetMinisterSongKeys = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
let SetMinisterSongKeys = class SetMinisterSongKeys {
    constructor(ministerSongKeyRepository, songRepository) {
        this.ministerSongKeyRepository = ministerSongKeyRepository;
        this.songRepository = songRepository;
    }
    async execute(input) {
        const map = new Map();
        for (const item of input.items) {
            map.set(item.song_id, item);
        }
        const uniqueItems = Array.from(map.values());
        const song_ids = uniqueItems.map((item) => item.song_id);
        if (song_ids.length) {
            const songs = await this.songRepository.findByIds(song_ids);
            if (songs.length !== song_ids.length) {
                throw new common_1.NotFoundException('One or more songs were not found');
            }
            for (const song of songs) {
                if (song.church_id !== input.church_id) {
                    throw new common_1.BadRequestException('Song does not belong to this church');
                }
            }
        }
        await Promise.all(uniqueItems.map((item) => this.ministerSongKeyRepository.upsertByMinisterAndSong(input.minister_id, item.song_id, item.custom_key)));
        const data = await this.ministerSongKeyRepository.listByMinister(input.minister_id);
        return { data };
    }
};
exports.SetMinisterSongKeys = SetMinisterSongKeys;
exports.SetMinisterSongKeys = SetMinisterSongKeys = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.MinisterSongKeyRepository,
        interfaces_1.SongRepository])
], SetMinisterSongKeys);
//# sourceMappingURL=use-case.js.map