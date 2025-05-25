import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { PasswordResetTokenRepository } from '../../../../database/repositories/interfaces';
import { PasswordResetToken } from '../../../../database/entities';
import { genToken, genExpiredDate } from '../../../helpers';
import { Output } from './output';
import { env } from '../../../../config';

@Injectable()
export class CreatePasswordResetToken {
  constructor(
    private repository: PasswordResetTokenRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    if (!input.user.email) {
      throw new Error('Error during verification token creation: user not found');
    }

    const PasswordResetToken: Partial<PasswordResetToken> = {
      token: genToken(),
      user_id: input.user.id,
      expires_at: genExpiredDate(env.codes_expired_in.verification_code)
    }
    const token = await this.repository.save(PasswordResetToken);

    if (!token) {
      throw new Error('Error creating verification token');
    }

    return { data: { token } }
  }
}
