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
exports.LoginController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const create_1 = require("../../../../core/use-cases/auth/create");
const validate_1 = require("../../../../core/use-cases/auth/validate");
const password_reset_token_1 = require("../../../../core/use-cases/password-reset-token");
const verification_code_1 = require("../../../../core/use-cases/verification-code");
const user_1 = require("../../../../core/use-cases/user");
const emails_1 = require("../../../../core/use-cases/emails");
const dtos_1 = require("../../dtos");
let LoginController = class LoginController {
    constructor(createToken, validateUser, createVerificationCode, createPasswordResetToken, verifyToken, getUser, sendResetPasswordToken, updatePasswordUser) {
        this.createToken = createToken;
        this.validateUser = validateUser;
        this.createVerificationCode = createVerificationCode;
        this.createPasswordResetToken = createPasswordResetToken;
        this.verifyToken = verifyToken;
        this.getUser = getUser;
        this.sendResetPasswordToken = sendResetPasswordToken;
        this.updatePasswordUser = updatePasswordUser;
    }
    async login(body, res) {
        const { data: user } = await this.validateUser.execute({ email: body.email, password: body.password });
        if (!user) {
            throw new common_1.UnauthorizedException('Credenciais inválidas');
        }
        const { email, name, is_verified } = user;
        if (!is_verified) {
            await this.createVerificationCode.execute({
                user,
            });
            return res.status(401).send({ message: 'Verify your email' });
        }
        const { data: { access_token } } = await this.createToken.execute({ id: user.id });
        res.setHeader('Authorization', `Bearer ${access_token}`);
        return res.status(200).send({ data: { email, name } });
    }
    async getValidateResetToken(query, res) {
        const { token, email } = query;
        const { data: user } = await this.getUser.execute({ search_by: 'email', search_data: email });
        if (!user?.id || !user.email) {
            return res.status(400).send({ message: "Token expired" });
        }
        const { data: isValid } = await this.verifyToken.execute({ token, user_id: user.id });
        if (!isValid) {
            return res.status(400).send({ message: "Token expired" });
        }
        return res.status(200).send({ message: "ok" });
    }
    async forgotPass({ email }) {
        try {
            const { data: user } = await this.getUser.execute({ search_by: 'email', search_data: email });
            if (!user?.id || !user.email) {
                throw new Error();
            }
            const { data: { token } } = await this.createPasswordResetToken.execute({ user });
            if (!token) {
                throw new Error();
            }
            this.sendResetPasswordToken.execute({
                email: user.email,
                token
            });
            return { message: 'Verify your email' };
        }
        catch (error) {
            console.log(error);
            throw new Error('Error creating token');
        }
    }
    async updatePass({ token }, { email, password }) {
        try {
            const { data: user } = await this.getUser.execute({ search_by: 'email', search_data: email });
            if (!user?.id || !user.email) {
                throw new Error('Error during validation token');
            }
            const { data: isValid } = await this.verifyToken.execute({ token, user_id: user.id });
            if (!isValid) {
                return { message: "Token expired" };
            }
            const passUpdated = await this.updatePasswordUser.execute({ email, password });
            if (!passUpdated) {
                throw new Error('Error during validation token');
            }
            return { message: 'Password updated' };
        }
        catch (error) {
            return { message: error.message };
        }
    }
};
exports.LoginController = LoginController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Autenticar usuário e gerar token JWT' }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.LoginBody,
        description: 'Credenciais do usuário',
        examples: {
            default: {
                summary: 'Login com e-mail e senha',
                value: {
                    email: 'maria.souza@example.com',
                    password: 'Strong#Password1',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Usuário autenticado com sucesso',
        schema: {
            example: {
                data: {
                    email: 'maria.souza@example.com',
                    name: 'Maria Souza',
                },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({
        description: 'Credenciais inválidas ou e-mail não verificado',
        schema: {
            example: {
                message: 'Verify your email',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.LoginBody, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('validate-reset-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Validar token de recuperação de senha' }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Token de recuperação recebido por e-mail', type: String }),
    (0, swagger_1.ApiQuery)({ name: 'email', description: 'E-mail associado ao token', type: String }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Token válido',
        schema: {
            example: {
                message: 'ok',
            },
        },
    }),
    (0, swagger_1.ApiBadRequestResponse)({
        description: 'Token inválido ou expirado',
        schema: {
            example: {
                message: 'Token expired',
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.CheckTokenQuery, Object]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "getValidateResetToken", null);
__decorate([
    (0, common_1.Post)('forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Gerar e enviar token de redefinição de senha' }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.ForgotPassBody,
        description: 'E-mail para envio do token de recuperação',
        examples: {
            default: {
                summary: 'Solicitação de redefinição',
                value: {
                    email: 'maria.souza@example.com',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Solicitação processada com sucesso',
        schema: {
            example: {
                message: 'Verify your email',
            },
        },
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.ForgotPassBody]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "forgotPass", null);
__decorate([
    (0, common_1.Post)('update-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Atualizar senha utilizando token de recuperação' }),
    (0, swagger_1.ApiQuery)({ name: 'token', description: 'Token de recuperação válido', type: String }),
    (0, swagger_1.ApiBody)({
        type: dtos_1.UpdatePasswordBody,
        description: 'Dados para redefinição de senha',
        examples: {
            default: {
                summary: 'Redefinição de senha',
                value: {
                    email: 'maria.souza@example.com',
                    password: 'NewStrong#Password2',
                },
            },
        },
    }),
    (0, swagger_1.ApiOkResponse)({
        description: 'Resultado da atualização de senha',
        schema: {
            example: {
                message: 'Password updated',
            },
        },
    }),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dtos_1.UpdatePasswordQuery,
        dtos_1.UpdatePasswordBody]),
    __metadata("design:returntype", Promise)
], LoginController.prototype, "updatePass", null);
exports.LoginController = LoginController = __decorate([
    (0, swagger_1.ApiTags)('Autenticação'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [create_1.CreateToken,
        validate_1.ValidateUser,
        verification_code_1.CreateVerificationCode,
        password_reset_token_1.CreatePasswordResetToken,
        password_reset_token_1.VerifyToken,
        user_1.GetUser,
        emails_1.SendResetPasswordToken,
        user_1.UpdatePasswordUser])
], LoginController);
//# sourceMappingURL=controller.js.map