import { SentMessageInfo } from "nodemailer";
import { EmailRepository } from "../interfaces";

export class FakeEmailRepository implements EmailRepository {
  sendResetPassword = jest.fn();
  sendVerificationCode = jest.fn();
  sendUserAlreadyExistsEmail = jest.fn();
}
