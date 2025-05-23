import { VerificationCodeRepository } from '../interfaces';

export class FakeVerificationCodeRepository implements VerificationCodeRepository {
  getLastCodeByUser = jest.fn();
  save = jest.fn();
  deleteByUserId = jest.fn();
  verifyCode = jest.fn();
}
