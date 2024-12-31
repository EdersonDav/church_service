import { Module } from '@nestjs/common';
import { CreateTask } from './create';
import { DataBaseModule } from '../../../database';
import { TaskController } from '../../../server/http/controllers/tasks';
@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateTask],
  exports: [CreateTask],
})
export class TaskModule { }
