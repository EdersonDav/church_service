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
exports.UserChurch = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const users_entity_1 = require("./users.entity");
const churches_entity_1 = require("./churches.entity");
let UserChurch = class UserChurch extends base_1.BaseEntity {
};
exports.UserChurch = UserChurch;
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.ChurchRoleEnum, default: enums_1.ChurchRoleEnum.VOLUNTARY, enumName: 'ChurchRoleEnum' }),
    __metadata("design:type", String)
], UserChurch.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserChurch.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.User)
], UserChurch.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid' }),
    __metadata("design:type", String)
], UserChurch.prototype, "church_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => churches_entity_1.Church, (church) => church.id, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'church_id' }),
    __metadata("design:type", churches_entity_1.Church)
], UserChurch.prototype, "church", void 0);
exports.UserChurch = UserChurch = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.USER_CHURCH),
    (0, typeorm_1.Unique)('user_church_unique', ['user', 'church'])
], UserChurch);
//# sourceMappingURL=user-church.entity.js.map