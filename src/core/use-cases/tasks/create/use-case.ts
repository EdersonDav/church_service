import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { TaskRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class CreateTask {
  constructor(
    private taskService: TaskRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.taskService.save(input)
    return {
      data: {
        name: data.name,
        description: data?.description || '',
        icon: data?.icon || ''
      }
    }
  }
}
