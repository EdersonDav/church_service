import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Task } from '../../entities';
import { TaskRepository } from '../interfaces';

@Injectable()
export class TaskService implements TaskRepository {
  private onConfliteConfig: any = {
    conflictPaths: ['name'],
    skipUpdateIfNoValuesChanged: true,
    upsertType: 'on-conflict-do-update',
  }
  constructor(
    @InjectRepository(Task)
    private readonly entity: TypeORMRepository<Task>
  ) { }

  async save(Task: Partial<Task>): Promise<Task> {
    const taskCreated = this.entity.create(Task);
    await this.entity.upsert(taskCreated, this.onConfliteConfig);
    return taskCreated;
  }
}
