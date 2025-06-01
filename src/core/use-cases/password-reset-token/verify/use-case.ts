import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { PasswordResetTokenRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';
import { validateHash } from '../../../helpers';

@Injectable()
export class VerifyToken {
  constructor(
    private repository: PasswordResetTokenRepository,
  ) { }
  async execute(input: Input): Promise<Output> {
    const verificationCode = await this.repository.verifyToken(input.user_id);
    return {
      data: !!(
        verificationCode &&
        (await validateHash({ hash: verificationCode.token, value: input.token }))
      )
    }
  }
}
