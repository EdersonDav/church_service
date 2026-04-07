import { Module } from '@nestjs/common';
import { CreateVerificationCode } from './create';
import { VerifyCode } from './verify';
import { DeleteCode } from './delete-code';
import { DataBaseModule } from '../../../database';

const verificationCodeUseCases = [
  CreateVerificationCode,
  VerifyCode,
  DeleteCode,
];
@Module({
  imports: [
    DataBaseModule
  ],
  providers: verificationCodeUseCases,
  exports: verificationCodeUseCases,
})
export class VerificationCodeModule { }
