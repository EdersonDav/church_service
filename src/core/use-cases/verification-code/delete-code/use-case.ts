import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { VerificationCodeRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class DeleteCode {
  constructor(
    private repository: VerificationCodeRepository,
  ) { }
  async execute({ user_id }: Input): Promise<void> {
    await this.repository.deleteByUserId(user_id);
  }
}
