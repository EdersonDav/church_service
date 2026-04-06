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
exports.CreatePasswordResetToken = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../../../database/repositories/interfaces");
const helpers_1 = require("../../../helpers");
const config_1 = require("../../../../config");
let CreatePasswordResetToken = class CreatePasswordResetToken {
    constructor(repository) {
        this.repository = repository;
    }
    async execute(input) {
        if (!input.user.email) {
            throw new Error('Error during verification token creation: user not found');
        }
        const tokenToSave = (0, helpers_1.genToken)();
        const PasswordResetToken = {
            token: tokenToSave,
            user_id: input.user.id,
            expires_at: (0, helpers_1.genExpiredDate)(config_1.env.codes_expired_in.verification_code)
        };
        const token = await this.repository.save(PasswordResetToken);
        if (!token) {
            throw new Error('Error creating verification token');
        }
        return { data: { token: tokenToSave } };
    }
};
exports.CreatePasswordResetToken = CreatePasswordResetToken;
exports.CreatePasswordResetToken = CreatePasswordResetToken = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [interfaces_1.PasswordResetTokenRepository])
], CreatePasswordResetToken);
//# sourceMappingURL=use-case.js.map