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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasswordResetTokenService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
const helpers_1 = require("../../../core/helpers");
let PasswordResetTokenService = class PasswordResetTokenService {
    constructor(entity) {
        this.entity = entity;
    }
    async save(token_data) {
        const tokenCreated = this.entity.create({
            ...token_data,
            token: (0, helpers_1.hashString)(token_data.token),
        });
        const tokenSaved = await this.entity.upsert(tokenCreated, {
            conflictPaths: ['user_id', 'token'],
            upsertType: 'on-conflict-do-update'
        });
        if (!tokenSaved) {
            throw new Error('Error creating verification token');
        }
        return tokenCreated.token;
    }
    async deleteByUserId(user_id) {
        await this.entity.delete({ user_id });
    }
    async verifyToken(user_id) {
        const tokenFound = await this.entity.findOne({ where: { user_id, expires_at: (0, typeorm_2.MoreThan)(new Date()) } });
        if (!tokenFound) {
            throw new Error('Token not found');
        }
        return tokenFound;
    }
};
exports.PasswordResetTokenService = PasswordResetTokenService;
exports.PasswordResetTokenService = PasswordResetTokenService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.PasswordResetToken)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], PasswordResetTokenService);
//# sourceMappingURL=password-reset-tokens.service.js.map