import { Module } from '@nestjs/common';
import { CreateVerificationCode } from './create';
import { MockDatabaseModule } from '../../../database/mock.module';

@Module({
  imports: [MockDatabaseModule],
  providers: [CreateVerificationCode],
  exports: [CreateVerificationCode],
})
export class MockVerificationCodeModule { }