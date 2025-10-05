import { Module } from '@nestjs/common';
import { CreateTask } from './create';
import { GetTask } from './get';
import { ListTasksBySector } from './list-by-sector';
import { UpdateTask } from './update';
import { DeleteTask } from './delete';
import { DataBaseModule } from '../../../database';

const useCases = [CreateTask, GetTask, ListTasksBySector, UpdateTask, DeleteTask];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class TaskModule { }
