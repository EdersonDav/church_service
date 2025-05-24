import { Module } from '@nestjs/common';
import { SendVerifyCode } from './send-verify-code';
import { SendUserAlreadyExists } from './send-user-already-exists';
import { DataBaseModule } from '../../../database';

const emailUseCases = [
  SendVerifyCode,
  SendUserAlreadyExists
];
@Module({
  imports: [
    DataBaseModule
  ],
  providers: emailUseCases,
  exports: emailUseCases,
})
export class EmailModule { }
