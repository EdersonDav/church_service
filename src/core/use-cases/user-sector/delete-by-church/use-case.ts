import { Injectable } from '@nestjs/common';
import { UserSectorRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteUserSectorsByChurch {
  constructor(
    private readonly userSectorRepository: UserSectorRepository
  ) { }

  async execute({ user_id, church_id }: Input): Promise<void> {
    await this.userSectorRepository.deleteByUserAndChurch(user_id, church_id);
  }
}
