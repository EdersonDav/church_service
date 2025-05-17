import { Module } from '@nestjs/common';
import { CreateUser } from './create';
import { DeleteUser } from './delete';
import { DataBaseModule } from '../../../database';

const useCases = [
  CreateUser,
  DeleteUser,
];
@Module({
  imports: [
    DataBaseModule,
  ],
  providers: useCases,
  exports: useCases,
})
export class UserModule { }
