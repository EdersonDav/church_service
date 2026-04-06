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
exports.Minister = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const churches_entity_1 = require("./churches.entity");
const users_entity_1 = require("./users.entity");
const minister_song_keys_entity_1 = require("./minister-song-keys.entity");
const scale_songs_entity_1 = require("./scale-songs.entity");
let Minister = class Minister extends base_1.BaseEntity {
};
exports.Minister = Minister;
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Minister.prototype, "church_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => churches_entity_1.Church, (church) => church.ministers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", churches_entity_1.Church)
], Minister.prototype, "church", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], Minister.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.ministers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.User)
], Minister.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Minister.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => minister_song_keys_entity_1.MinisterSongKey, (item) => item.minister),
    __metadata("design:type", Array)
], Minister.prototype, "song_keys", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scale_songs_entity_1.ScaleSong, (item) => item.minister),
    __metadata("design:type", Array)
], Minister.prototype, "scale_songs", void 0);
exports.Minister = Minister = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.MINISTER),
    (0, typeorm_1.Unique)(['church_id', 'user_id'])
], Minister);
//# sourceMappingURL=ministers.entity.js.map