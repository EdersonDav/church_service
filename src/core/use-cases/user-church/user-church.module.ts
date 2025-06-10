import { Module } from '@nestjs/common';
import { CreateUserChurch } from './create';
import { DataBaseModule } from '../../../database';
import { GetUserChurch } from './get';
import { GetUserChurchMembers } from './get-members';

const useCases = [
  CreateUserChurch,
  GetUserChurch,
  GetUserChurchMembers
];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class UserChurchModule { }
