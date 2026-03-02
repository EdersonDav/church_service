import { Injectable } from '@nestjs/common';
import { UserChurchRepository } from '../../../../database/repositories/interfaces';
import { Input } from './input';

@Injectable()
export class DeleteUserChurch {
  constructor(
    private readonly userChurchRepository: UserChurchRepository
  ) { }

  async execute({ user_id, church_id }: Input): Promise<void> {
    await this.userChurchRepository.deleteByUserAndChurch(user_id, church_id);
  }
}
