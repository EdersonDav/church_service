import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { join } from "path";
import { SentMessageInfo } from "nodemailer";
import { EmailRepository } from "../interfaces";

@Injectable()
export class EmailService implements EmailRepository{
    constructor(private readonly mailer: MailerService) {}
    async sendVerificationCode(email: string, code: string): Promise<SentMessageInfo> {
        const templatePath = join(process.cwd(), 'assets', 'templates', 'verify');
        return this.mailer.sendMail({
            to: email,
            subject: 'Seu código de verificação',
            template: templatePath,
            context: { code },
        });
    }
}
