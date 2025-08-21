import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserSectorRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class GetUserSectorMembers {
  constructor(
    private userSectorService: UserSectorRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userSectorService.getSectorMembers(
      input.sector_id
    );
    return {
      data
    };
  }
}
