import { Module } from '@nestjs/common';
import { CreatePasswordResetToken } from './create';
import { VerifyToken } from './verify';
import { DeleteToken } from './delete-token';
import { DataBaseModule } from '../../../database';

const passwordResetTokenUseCases = [
  CreatePasswordResetToken,
  VerifyToken,
  DeleteToken
];
@Module({
  imports: [
    DataBaseModule
  ],
  providers: passwordResetTokenUseCases,
  exports: passwordResetTokenUseCases,
})
export class PasswordResetTokenModule { }
