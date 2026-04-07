import { Module } from '@nestjs/common';
import { CreatePasswordResetToken } from './create';
import { VerifyToken } from './verify';
import { DeleteToken } from './delete-token';
import { MockDatabaseModule } from '../../../database/mock.module';

const passwordResetTokenUseCases = [
  CreatePasswordResetToken,
  VerifyToken,
  DeleteToken
];

@Module({
  imports: [MockDatabaseModule],
  providers: passwordResetTokenUseCases,
  exports: passwordResetTokenUseCases,
})
export class MockVerificationCodeModule { }