import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { join } from "path";
import { SentMessageInfo } from "nodemailer";
import { EmailRepository } from "../interfaces";
import { env } from "../../../config";

@Injectable()
export class EmailService implements EmailRepository {
    constructor(private readonly mailer: MailerService) { }
    async sendVerificationCode(email: string, code: string): Promise<SentMessageInfo> {
        const templatePath = join(process.cwd(), 'assets', 'templates', 'verify');
        return this.mailer.sendMail({
            to: email,
            subject: `${env.app_name}: Seu código de verificação`,
            template: templatePath,
            context: { code },
        });
    }

    async sendUserAlreadyExistsEmail(email: string): Promise<SentMessageInfo> {
        const templatePath = join(process.cwd(), 'assets', 'templates', 'update-account');
        return this.mailer.sendMail({
            to: email,
            subject: `${env.app_name}: Email já cadastrado`,
            template: templatePath,
        });
    }

    async sendResetPassword(email: string, token: string): Promise<SentMessageInfo> {
        const templatePath = join(process.cwd(), 'assets', 'templates', 'reset-password');
        return this.mailer.sendMail({
            to: email,
            subject: `${env.app_name}: Redefinição de senha`,
            template: templatePath,
            from: env.mail.from,
            context: { url: `${env.mail.reset_password_url}?token=${token}` },
        });
    }
}
