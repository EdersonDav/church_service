import { PasswordResetTokenRepository } from '../interfaces';

export class FakePasswordResetTokenRepository implements PasswordResetTokenRepository {
  save = jest.fn();
  deleteByUserId = jest.fn();
  verifyToken = jest.fn();
}
