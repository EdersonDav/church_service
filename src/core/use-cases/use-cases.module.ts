import { Module } from '@nestjs/common';
import { AuthModule } from './auth';
import { DataBaseModule } from '../../database';
import { TaskModule } from './tasks';
import { ChurchModule } from './church';
import { UserModule } from './user';
import { VerificationCodeModule } from './verification-code';
import { PasswordResetTokenModule } from './password-reset-token';
import { EmailModule } from './emails';
import { UserChurchModule } from './user-church';

const modules = [
  TaskModule,
  ChurchModule,
  UserModule,
  VerificationCodeModule,
  EmailModule,
  PasswordResetTokenModule,
  AuthModule,
  UserChurchModule,
];

@Module({
  imports: [...modules, DataBaseModule],
  exports: [...modules],
})
export class UseCasesModule { }
