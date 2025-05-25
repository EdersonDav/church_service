import { Module } from '@nestjs/common';
import { CreatePasswordResetToken } from './create';
import { VerifyToken } from './verify';
import { DeleteToken } from './delete-token';
import { GetToken } from './get';
import { MockDatabaseModule } from '../../../database/mock.module';

const passwordResetTokenUseCases = [
  CreatePasswordResetToken,
  VerifyToken,
  DeleteToken,
  GetToken
];

@Module({
  imports: [MockDatabaseModule],
  providers: passwordResetTokenUseCases,
  exports: passwordResetTokenUseCases,
})
export class MockVerificationCodeModule { }