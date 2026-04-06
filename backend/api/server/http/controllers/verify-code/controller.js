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
exports.VerificationCodeController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dtos_1 = require("../../dtos");
const verify_1 = require("../../../../core/use-cases/verification-code/verify");
const delete_code_1 = require("../../../../core/use-cases/verification-code/delete-code");
const get_1 = require("../../../../core/use-cases/user/get");
const mark_as_verify_1 = require("../../../../core/use-cases/user/mark-as-verify");
let VerificationCodeController = class VerificationCodeController {
    constructor(verifyCode, deleteCode, getUser, markAsVerifiedUser) {
        this.verifyCode = verifyCode;
        this.deleteCode = deleteCode;
        this.getUser = getUser;
        this.markAsVerifiedUser = markAsVerifiedUser;
    }
    async create({ code, email }) {
        let message = 'Invalid code or email';
        const user = await this.getUser.execute({ search_by: 'email', search_data: email });
        if (!user.data?.id) {
            return {
                data: { message }
            };
        }
        const verificationCode = await this.verifyCode.execute({ code, user_id: user.data?.id });
        if (!verificationCode.data) {
            return {
                data: { message }
            };
        }
        await Promise.all([
            this.markAsVerifiedUser.execute({ user_id: user.data?.id }),
            this.deleteCode.execute({ user_id: user.data?.id })
        ]);
        return {
            data: { message: 'User verified successfully' }
        };
    }
};
exports.VerificationCodeController = VerificationCodeController;
__decorate([
    (0, common_1.Post)(''),
    (0, swagger_1.ApiOperation)({ summary: 'Validar código de verificação enviado por e-mail' }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.VerifyCodeBody,
        description: 'Código recebido por e-mail e e-mail do usuário',
        examples: {
            default: {
                summary: 'Validação de código',
                value: {
                    email: 'maria.souza@example.com',
                    code: '123456',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Resultado da validação do código',
        schema: {
            example: {
                data: {
                    message: 'User verified successfully',
                },
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.VerifyCodeBody]),
    __metadata("design:returntype", Promise)
], VerificationCodeController.prototype, "create", null);
exports.VerificationCodeController = VerificationCodeController = __decorate([
    (0, swagger_1.ApiTags)('Verificação de Código'),
    (0, common_1.Controller)('verify-code/user'),
    __metadata("design:paramtypes", [verify_1.VerifyCode,
        delete_code_1.DeleteCode,
        get_1.GetUser,
        mark_as_verify_1.MarkAsVerifiedUser])
], VerificationCodeController);
//# sourceMappingURL=controller.js.map