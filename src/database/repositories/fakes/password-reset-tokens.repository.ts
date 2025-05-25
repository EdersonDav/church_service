import { PasswordResetToken } from '../../entities';
import { PasswordResetTokenRepository } from '../interfaces';

export class FakePasswordResetTokenRepository implements PasswordResetTokenRepository {
  get = jest.fn();
  save = jest.fn();
  deleteByUserId = jest.fn();
  verifyToken = jest.fn();
}
