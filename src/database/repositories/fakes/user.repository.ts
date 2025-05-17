import { User } from '../../entities';
import { UserRepository } from '../interfaces';

export class FakeUserRepository implements UserRepository {
  getByEmail = jest.fn();
  save = jest.fn();
  update = jest.fn();
  deleteByEmail = jest.fn();
}
