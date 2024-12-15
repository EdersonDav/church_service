import { UserRepository } from '../interfaces';

export class FakeUserRepository implements UserRepository {
  getByEmail = jest.fn();
  save = jest.fn();
}
