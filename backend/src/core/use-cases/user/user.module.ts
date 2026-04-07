import { Module } from '@nestjs/common';
import { CreateUser } from './create';
import { DeleteUser } from './delete';
import { UpdateUser } from './update';
import { UpdatePasswordUser } from './update-password';
import { GetNotVerifiedUser } from './get-no-verified';
import { GetUser } from './get';
import { DataBaseModule } from '../../../database';
import { MarkAsVerifiedUser } from './mark-as-verify';

const useCases = [
  CreateUser,
  UpdateUser,
  GetNotVerifiedUser,
  DeleteUser,
  GetUser,
  MarkAsVerifiedUser,
  UpdatePasswordUser
];
@Module({
  imports: [
    DataBaseModule,
  ],
  providers: useCases,
  exports: useCases,
})
export class UserModule { }
