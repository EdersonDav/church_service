import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { PasswordResetTokenRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class GetToken {
  constructor(
    private repository: PasswordResetTokenRepository,
  ) { }
  async execute(input: Input): Promise<Output> {
    const verificationCode = await this.repository.get(input.token);
    return {
      data: !!(verificationCode)
    }
  }
}
