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
exports.ScaleSong = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const scales_entity_1 = require("./scales.entity");
const songs_entity_1 = require("./songs.entity");
const ministers_entity_1 = require("./ministers.entity");
let ScaleSong = class ScaleSong extends base_1.BaseEntity {
};
exports.ScaleSong = ScaleSong;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ScaleSong.prototype, "scale_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => scales_entity_1.Scale, (scale) => scale.songs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'scale_id' }),
    __metadata("design:type", scales_entity_1.Scale)
], ScaleSong.prototype, "scale", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ScaleSong.prototype, "song_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => songs_entity_1.Song, (song) => song.scale_songs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'song_id' }),
    __metadata("design:type", songs_entity_1.Song)
], ScaleSong.prototype, "song", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ScaleSong.prototype, "key", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], ScaleSong.prototype, "minister_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => ministers_entity_1.Minister, (minister) => minister.scale_songs, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        nullable: true,
    }),
    (0, typeorm_1.JoinColumn)({ name: 'minister_id' }),
    __metadata("design:type", Object)
], ScaleSong.prototype, "minister", void 0);
exports.ScaleSong = ScaleSong = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.SCALE_SONG),
    (0, typeorm_1.Unique)(['scale_id', 'song_id'])
], ScaleSong);
//# sourceMappingURL=scale-songs.entity.js.map