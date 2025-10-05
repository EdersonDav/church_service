import { TaskRepository } from '../interfaces';

export class FakeTaskRepository implements TaskRepository {
  save = jest.fn();
  delete = jest.fn();
  findById = jest.fn();
  findBySector = jest.fn();
  update = jest.fn();
  findByIds = jest.fn();
}
