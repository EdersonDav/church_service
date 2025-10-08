import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeORMRepository } from 'typeorm';
import { Task } from '../../entities';
import { TaskRepository } from '../interfaces';

@Injectable()
export class TaskService implements TaskRepository {
  constructor(
    @InjectRepository(Task)
    private readonly entity: TypeORMRepository<Task>
  ) { }

  async save(task: Partial<Task>): Promise<Task> {
    const taskCreated = this.entity.create(task);
    return this.entity.save(taskCreated);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async findById(id: string): Promise<Task | null> {
    return this.entity.findOne({ where: { id } });
  }

  async findBySector(sector_id: string): Promise<Task[]> {
    return this.entity.find({ where: { sector_id } });
  }

  async update(task_id: string, task_set: Partial<Task>): Promise<Task | null> {
    const task = await this.entity.findOne({ where: { id: task_id } });
    if (!task) {
      return null;
    }

    Object.assign(task, task_set);
    return this.entity.save(task);
  }

  async findByIds(task_ids: string[]): Promise<Task[]> {
    if (!task_ids.length) {
      return [];
    }

    return this.entity.find({ where: { id: In(task_ids) } });
  }
}
