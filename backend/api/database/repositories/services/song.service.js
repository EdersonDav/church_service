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
exports.SongService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let SongService = class SongService {
    constructor(entity) {
        this.entity = entity;
    }
    async save(song_data) {
        const song = this.entity.create(song_data);
        return this.entity.save(song);
    }
    async delete(id) {
        await this.entity.delete(id);
    }
    async getById(song_id) {
        return this.entity.findOneBy({ id: song_id });
    }
    async listByChurch(church_id) {
        return this.entity.find({
            where: { church_id },
            order: { title: 'ASC' },
        });
    }
    async findByIds(song_ids) {
        if (!song_ids.length) {
            return [];
        }
        return this.entity.find({
            where: { id: (0, typeorm_2.In)(song_ids) },
        });
    }
    async update(song_id, song_set) {
        const song = await this.entity.findOneBy({ id: song_id });
        if (!song) {
            return null;
        }
        Object.assign(song, song_set);
        return this.entity.save(song);
    }
};
exports.SongService = SongService;
exports.SongService = SongService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Song)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SongService);
//# sourceMappingURL=song.service.js.map