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
exports.PasswordResetToken = void 0;
const typeorm_1 = require("typeorm");
const users_entity_1 = require("./users.entity");
const base_1 = require("./base");
const enums_1 = require("../../enums");
let PasswordResetToken = class PasswordResetToken extends base_1.BaseEntity {
};
exports.PasswordResetToken = PasswordResetToken;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], PasswordResetToken.prototype, "expires_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => users_entity_1.User, (user) => user.reset_tokens, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", users_entity_1.User)
], PasswordResetToken.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], PasswordResetToken.prototype, "user_id", void 0);
exports.PasswordResetToken = PasswordResetToken = __decorate([
    (0, typeorm_1.Entity)(enums_1.EntityEnum.PASSWORD_RESET_TOKEN),
    (0, typeorm_1.Unique)(['user_id', 'token'])
], PasswordResetToken);
//# sourceMappingURL=password-reset-token.entity.js.map