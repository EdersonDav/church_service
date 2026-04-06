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
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const sectors_entity_1 = require("./sectors.entity");
const participants_entity_1 = require("./participants.entity");
let Task = class Task extends base_1.BaseEntity {
};
exports.Task = Task;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Task.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "icon", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Task.prototype, "sector_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sectors_entity_1.Sector, (sector) => sector.tasks, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    __metadata("design:type", sectors_entity_1.Sector)
], Task.prototype, "sector", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participants_entity_1.Participant, (participant) => participant.task),
    __metadata("design:type", Array)
], Task.prototype, "participants", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.TASK),
    (0, typeorm_1.Unique)(['name'])
], Task);
//# sourceMappingURL=tasks.entity.js.map