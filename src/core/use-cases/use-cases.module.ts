import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DataBaseModule } from '../../database';
import { TaskModule } from './tasks';
import { ChurchModule } from './church';
import { UserModule } from './user';

const modules = [AuthModule, TaskModule, ChurchModule, UserModule];

@Module({
  imports: [...modules, DataBaseModule],
  exports: modules,
})
export class UseCasesModule { }
