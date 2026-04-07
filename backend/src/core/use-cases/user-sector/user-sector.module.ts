import { Module } from '@nestjs/common';
import { CreateUserSector } from './create';
import { DataBaseModule } from '../../../database';
import { GetUserSector } from './get';
import { GetUserSectorMembers } from './get-members';
import { DeleteUserSector } from './delete';
import { DeleteUserSectorsByChurch } from './delete-by-church';

const useCases = [
  CreateUserSector,
  GetUserSector,
  GetUserSectorMembers,
  DeleteUserSector,
  DeleteUserSectorsByChurch
];

@Module({
  imports: [
    DataBaseModule,
  ],
  providers: [...useCases],
  exports: [...useCases],
})
export class UserSectorModule { }
