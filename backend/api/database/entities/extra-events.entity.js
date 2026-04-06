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
exports.ExtraEvent = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const churches_entity_1 = require("./churches.entity");
let ExtraEvent = class ExtraEvent extends base_1.BaseEntity {
};
exports.ExtraEvent = ExtraEvent;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExtraEvent.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExtraEvent.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ExtraEvent.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ExtraEvent.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], ExtraEvent.prototype, "church_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => churches_entity_1.Church, { onDelete: 'CASCADE', onUpdate: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", churches_entity_1.Church)
], ExtraEvent.prototype, "church", void 0);
exports.ExtraEvent = ExtraEvent = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.EXTRA_EVENT)
], ExtraEvent);
//# sourceMappingURL=extra-events.entity.js.map