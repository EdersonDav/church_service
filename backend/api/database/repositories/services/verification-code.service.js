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
exports.VerificationCodeService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../../entities");
let VerificationCodeService = class VerificationCodeService {
    constructor(entity) {
        this.entity = entity;
    }
    async getLastCodeByUser(user_id) {
        const codeFound = await this.entity.findOne({ where: { user_id }, order: { created_at: 'DESC' } });
        return codeFound;
    }
    async save(code_data) {
        const codeCreated = this.entity.create(code_data);
        const codeSaved = await this.entity.upsert(codeCreated, {
            conflictPaths: ['user_id', 'code'],
            upsertType: 'on-conflict-do-update'
        });
        if (!codeSaved) {
            throw new Error('Error creating verification code');
        }
        return codeCreated.code;
    }
    async deleteByUserId(user_id) {
        await this.entity.delete({ user_id });
    }
    async verifyCode(code, user_id) {
        const codeFound = await this.entity.findOne({ where: { code, user_id, expires_at: (0, typeorm_2.MoreThan)(new Date()) } });
        if (!codeFound) {
            throw new Error('Code not found');
        }
        return codeFound;
    }
};
exports.VerificationCodeService = VerificationCodeService;
exports.VerificationCodeService = VerificationCodeService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.VerificationCode)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], VerificationCodeService);
//# sourceMappingURL=verification-code.service.js.map