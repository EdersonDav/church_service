import { Module } from '@nestjs/common';
import { CreateTask } from './create';
import { DataBaseModule } from '../../../database';

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateTask],
  exports: [CreateTask],
})
export class TaskModule { }
