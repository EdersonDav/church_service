import { Module } from '@nestjs/common';
import { CreateVerificationCode } from './create';
import { DataBaseModule } from '../../../database';
import { UserModule } from '../user';

@Module({
  imports: [
    DataBaseModule,
    UserModule
  ],
  providers: [CreateVerificationCode],
  exports: [CreateVerificationCode],
})
export class VerificationCodeModule { }
