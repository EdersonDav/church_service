import { Module } from '@nestjs/common';
import { CreateVerificationCode } from './create';
import { DataBaseModule } from '../../../database';

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [CreateVerificationCode],
  exports: [CreateVerificationCode],
})
export class VerificationCodeModule { }
