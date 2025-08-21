import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserSectorRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class GetUserSector {
  constructor(
    private userSectorService: UserSectorRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userSectorService.getByUserAndSector(
      input.user_id,
      input.sector_id
    );
    return {
      data
    };
  }
}
