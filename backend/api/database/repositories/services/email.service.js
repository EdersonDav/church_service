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
exports.EmailService = void 0;
const mailer_1 = require("@nestjs-modules/mailer");
const common_1 = require("@nestjs/common");
const path_1 = require("path");
const config_1 = require("../../../config");
let EmailService = class EmailService {
    constructor(mailer) {
        this.mailer = mailer;
    }
    async sendVerificationCode(email, code) {
        const templatePath = (0, path_1.join)(process.cwd(), 'assets', 'templates', 'verify');
        return this.mailer.sendMail({
            to: email,
            subject: `${config_1.env.app_name}: Seu código de verificação`,
            template: templatePath,
            context: { code },
        });
    }
    async sendUserAlreadyExistsEmail(email) {
        const templatePath = (0, path_1.join)(process.cwd(), 'assets', 'templates', 'update-account');
        return this.mailer.sendMail({
            to: email,
            subject: `${config_1.env.app_name}: Email já cadastrado`,
            template: templatePath,
        });
    }
    async sendResetPassword(email, token) {
        const templatePath = (0, path_1.join)(process.cwd(), 'assets', 'templates', 'reset-password');
        return this.mailer.sendMail({
            to: email,
            subject: `${config_1.env.app_name}: Redefinição de senha`,
            template: templatePath,
            from: config_1.env.mail.from,
            context: { url: `${config_1.env.mail.reset_password_url}?token=${token}` },
        });
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [mailer_1.MailerService])
], EmailService);
//# sourceMappingURL=email.service.js.map