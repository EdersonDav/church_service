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
exports.Church = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const sectors_entity_1 = require("./sectors.entity");
const extra_events_entity_1 = require("./extra-events.entity");
const songs_entity_1 = require("./songs.entity");
const ministers_entity_1 = require("./ministers.entity");
let Church = class Church extends base_1.BaseEntity {
};
exports.Church = Church;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Church.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Church.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sectors_entity_1.Sector, (sector) => sector.church),
    __metadata("design:type", Array)
], Church.prototype, "sectors", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => extra_events_entity_1.ExtraEvent, (event) => event.church),
    __metadata("design:type", Array)
], Church.prototype, "extra_events", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => songs_entity_1.Song, (song) => song.church),
    __metadata("design:type", Array)
], Church.prototype, "songs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ministers_entity_1.Minister, (minister) => minister.church),
    __metadata("design:type", Array)
], Church.prototype, "ministers", void 0);
exports.Church = Church = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.CHURCH)
], Church);
//# sourceMappingURL=churches.entity.js.map