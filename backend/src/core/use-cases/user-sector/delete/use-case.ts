import { Injectable } from '@nestjs/common';
import { UserSectorRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteUserSector {
  constructor(
    private readonly userSectorRepository: UserSectorRepository
  ) { }

  async execute({ user_id, sector_id }: Input): Promise<void> {
    await this.userSectorRepository.deleteByUserAndSector(user_id, sector_id);
  }
}
