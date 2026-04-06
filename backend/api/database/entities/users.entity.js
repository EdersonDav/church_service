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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const base_1 = require("./base");
const enums_1 = require("../../enums");
const unavailability_entity_1 = require("./unavailability.entity");
const participants_entity_1 = require("./participants.entity");
const verification_code_entity_1 = require("./verification-code.entity");
const password_reset_token_entity_1 = require("./password-reset-token.entity");
const ministers_entity_1 = require("./ministers.entity");
let User = class User extends base_1.BaseEntity {
};
exports.User = User;
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => unavailability_entity_1.Unavailability, (unavailability) => unavailability.user),
    __metadata("design:type", Array)
], User.prototype, "unavailability", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => participants_entity_1.Participant, (participant) => participant.user),
    __metadata("design:type", Array)
], User.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_verified", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => verification_code_entity_1.VerificationCode, (v) => v.user),
    __metadata("design:type", Array)
], User.prototype, "codes", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => password_reset_token_entity_1.PasswordResetToken, (t) => t.user),
    __metadata("design:type", Array)
], User.prototype, "reset_tokens", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ministers_entity_1.Minister, (minister) => minister.user),
    __metadata("design:type", Array)
], User.prototype, "ministers", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date', nullable: true, default: null }),
    __metadata("design:type", Object)
], User.prototype, "birthday", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.USER),
    (0, typeorm_1.Unique)(['email'])
], User);
//# sourceMappingURL=users.entity.js.map