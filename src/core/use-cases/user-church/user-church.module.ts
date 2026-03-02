import { Module } from '@nestjs/common';
import { CreateUserChurch } from './create';
import { DataBaseModule } from '../../../database';
import { GetUserChurch } from './get';
import { GetUserChurchMembers } from './get-members';
import { DeleteUserChurch } from './delete';

const useCases = [
  CreateUserChurch,
  GetUserChurch,
  GetUserChurchMembers,
  DeleteUserChurch
];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class UserChurchModule { }
