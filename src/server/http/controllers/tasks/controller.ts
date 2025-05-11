import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CreateTask } from '../../../../core/use-cases/tasks';
import { TaskBody } from '../../dtos/tasks/query';
import { TaskResponseData } from '../../dtos/tasks/response';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTask: CreateTask
  ) { }

  @Post('')
  async task(
    @Body() body: TaskBody
  ): Promise<TaskResponseData> {
    if (!body.name) {
      throw new BadRequestException('Name is necessary');
    }

    const { data } = await this.createTask.execute(body);

    return data
  }
}