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
exports.Song = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const churches_entity_1 = require("./churches.entity");
const minister_song_keys_entity_1 = require("./minister-song-keys.entity");
const scale_songs_entity_1 = require("./scale-songs.entity");
let Song = class Song extends base_1.BaseEntity {
};
exports.Song = Song;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Song.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Song.prototype, "default_key", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Song.prototype, "church_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => churches_entity_1.Church, (church) => church.songs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", churches_entity_1.Church)
], Song.prototype, "church", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => minister_song_keys_entity_1.MinisterSongKey, (item) => item.song),
    __metadata("design:type", Array)
], Song.prototype, "minister_song_keys", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scale_songs_entity_1.ScaleSong, (item) => item.song),
    __metadata("design:type", Array)
], Song.prototype, "scale_songs", void 0);
exports.Song = Song = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.SONG),
    (0, typeorm_1.Unique)(['church_id', 'title'])
], Song);
//# sourceMappingURL=songs.entity.js.map