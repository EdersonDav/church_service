import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserSectorRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';
import { SectorRoleEnum } from '../../../../enums';

@Injectable()
export class CreateUserSector {
  constructor(
    private userSectorService: UserSectorRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userSectorService.save(input)
    return {
      data: {
        sector_id: data.sector_id as UUID,
        user_id: data.user_id as UUID,
        role: data.role as SectorRoleEnum
      }
    }
  }
}
