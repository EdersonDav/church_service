import { Module } from '@nestjs/common';
import { SendVerifyCode } from './send-verify-code';
import { SendUserAlreadyExists } from './send-user-already-exists';
import { SendResetPasswordToken } from './send-reset-password';
import { DataBaseModule } from '../../../database';

const emailUseCases = [
  SendVerifyCode,
  SendUserAlreadyExists,
  SendResetPasswordToken
];
@Module({
  imports: [
    DataBaseModule
  ],
  providers: emailUseCases,
  exports: emailUseCases,
})
export class EmailModule { }
