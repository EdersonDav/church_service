import { ChurchRepository } from '../interfaces';

export class FakeChurchRepository implements ChurchRepository {
  save = jest.fn();
  delete = jest.fn();
  update = jest.fn();
}
