import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DataBaseModule } from '../../database';
import { TaskModule } from './tasks';
import { ChurchModule } from './church';
import { UserModule } from './user';
import { VerificationCodeModule } from './verification-code';

const modules = [AuthModule, TaskModule, ChurchModule, UserModule, VerificationCodeModule];

@Module({
  imports: [...modules, DataBaseModule],
  exports: modules,
})
export class UseCasesModule { }
