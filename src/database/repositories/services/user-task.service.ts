import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { UserTask } from '../../entities';
import { UserTaskRepository } from '../interfaces';

@Injectable()
export class UserTaskService implements UserTaskRepository {
  constructor(
    @InjectRepository(UserTask)
    private readonly entity: TypeORMRepository<UserTask>
  ) { }

  async save(userTask: Partial<UserTask>): Promise<UserTask> {
    const created = this.entity.create(userTask);
    return this.entity.save(created);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async findByUser(user_id: string): Promise<UserTask[]> {
    return this.entity.find({
      where: { user_id },
      relations: {
        task: true,
      },
    });
  }

  async findByUserAndTask(user_id: string, task_id: string): Promise<UserTask | null> {
    return this.entity.findOne({
      where: { user_id, task_id },
      relations: {
        task: true,
      },
    });
  }
}
