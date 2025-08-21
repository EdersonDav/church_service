import { Module } from '@nestjs/common';
import { CreateUserSector } from './create';
import { DataBaseModule } from '../../../database';
import { GetUserSector } from './get';
import { GetUserSectorMembers } from './get-members';

const useCases = [
  CreateUserSector,
  GetUserSector,
  GetUserSectorMembers
];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class UserSectorModule { }
