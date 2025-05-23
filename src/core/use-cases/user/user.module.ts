import { Module } from '@nestjs/common';
import { CreateUser } from './create';
import { DeleteUser } from './delete';
import { UpdateUser } from './update';
import { GetNotVerifiedUser } from './getNoVerified';
import { GetUser } from './get';
import { DataBaseModule } from '../../../database';
import { MarkAsVerifiedUser } from './markAsVerify';

const useCases = [
  CreateUser,
  UpdateUser,
  GetNotVerifiedUser,
  DeleteUser,
  GetUser, 
  MarkAsVerifiedUser
];
@Module({
  imports: [
    DataBaseModule,
  ],
  providers: useCases,
  exports: useCases,
})
export class UserModule { }
