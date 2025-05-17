import { SentMessageInfo } from "nodemailer";

export abstract class EmailRepository {
  abstract sendVerificationCode(email: string, code: string): Promise<SentMessageInfo>;
}
