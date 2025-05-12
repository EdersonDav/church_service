import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateTask } from '../../../../core/use-cases/tasks';
import { CreateTaskBody, CreateTaskResponseData } from '../../dtos/tasks';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTask: CreateTask
  ) { }

  @Post('')
  async task(
    @Body() body: CreateTaskBody
  ): Promise<CreateTaskResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.createTask.execute(body);

    return data
  }
}