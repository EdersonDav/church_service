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
exports.Scale = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const sectors_entity_1 = require("./sectors.entity");
const participants_entity_1 = require("./participants.entity");
const scale_songs_entity_1 = require("./scale-songs.entity");
let Scale = class Scale extends base_1.BaseEntity {
};
exports.Scale = Scale;
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Scale.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Scale.prototype, "sector_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sectors_entity_1.Sector, (sector) => sector.scales),
    __metadata("design:type", sectors_entity_1.Sector)
], Scale.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participants_entity_1.Participant, (participant) => participant.scale),
    __metadata("design:type", Array)
], Scale.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scale_songs_entity_1.ScaleSong, (scale_song) => scale_song.scale),
    __metadata("design:type", Array)
], Scale.prototype, "songs", void 0);
exports.Scale = Scale = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.SCALE),
    (0, typeorm_1.Unique)(['sector_id', 'date'])
], Scale);
//# sourceMappingURL=scales.entity.js.map