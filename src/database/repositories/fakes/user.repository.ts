import { UserRepository } from '../interfaces';

export class FakeUserRepository implements UserRepository {
  getBy = jest.fn();
  save = jest.fn();
  update = jest.fn();
  deleteByEmail = jest.fn();
  getNotVerifiedByEmail = jest.fn();
  markAsVerified = jest.fn();
}
