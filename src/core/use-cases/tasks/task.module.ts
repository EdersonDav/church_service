import { Module } from '@nestjs/common';
import { LoginController } from '../../../server/http/controllers/login';
import { CreateTask } from './create';
import { DataBaseModule } from '../../../database';
@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateTask],
  controllers: [LoginController],
  exports: [CreateTask],
})
export class TaskModule { }
