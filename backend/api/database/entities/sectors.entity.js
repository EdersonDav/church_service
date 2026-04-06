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
exports.Sector = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const churches_entity_1 = require("./churches.entity");
const tasks_entity_1 = require("./tasks.entity");
const scales_entity_1 = require("./scales.entity");
let Sector = class Sector extends base_1.BaseEntity {
};
exports.Sector = Sector;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Sector.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => churches_entity_1.Church, (church) => church.sectors, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", churches_entity_1.Church)
], Sector.prototype, "church", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Sector.prototype, "church_id", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => tasks_entity_1.Task, (task) => task.sector),
    __metadata("design:type", Array)
], Sector.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => scales_entity_1.Scale, (scale) => scale.sector),
    __metadata("design:type", Array)
], Sector.prototype, "scales", void 0);
exports.Sector = Sector = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.SECTOR),
    (0, typeorm_1.Unique)(['name', 'church_id'])
], Sector);
//# sourceMappingURL=sectors.entity.js.map