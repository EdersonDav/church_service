import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DataBaseModule } from '../../database';
import { TaskModule } from './tasks';
import { ChurchModule } from './church';

const modules = [AuthModule, TaskModule, ChurchModule];

@Module({
  imports: [...modules, DataBaseModule],
  exports: modules,
})
export class UseCasesModule { }
