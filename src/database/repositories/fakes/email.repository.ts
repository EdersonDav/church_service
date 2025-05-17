import { EmailRepository } from "../interfaces";

export class FakeEmailRepository implements EmailRepository {
  sendVerificationCode = jest.fn();
}
