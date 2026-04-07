import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { PasswordResetTokenRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class DeleteToken {
  constructor(
    private repository: PasswordResetTokenRepository,
  ) { }
  async execute({ user_id }: Input): Promise<void> {
    await this.repository.deleteByUserId(user_id);
  }
}
