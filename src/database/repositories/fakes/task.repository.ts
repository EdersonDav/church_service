import { TaskRepository } from '../interfaces';

export class FakeTaskRepository implements TaskRepository {
  save = jest.fn();
  delete = jest.fn();
}
