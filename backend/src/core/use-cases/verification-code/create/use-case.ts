import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { VerificationCodeRepository } from '../../../../database/repositories/interfaces';
import { VerificationCode } from '../../../../database/entities';
import { genCode, genExpiredDate } from '../../../helpers';
import { Output } from './output';
import { env } from '../../../../config';

@Injectable()
export class CreateVerificationCode {
  constructor(
    private repository: VerificationCodeRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    if (!input.user.email) {
      throw new Error('Error during verification code creation: user not found');
    }

    const verificationCode: Partial<VerificationCode> = {
      code: genCode(),
      user_id: input.user.id,
      expires_at: genExpiredDate(env.codes_expired_in.verification_code)
    }
    const code = await this.repository.save(verificationCode);

    if (!code) {
      throw new Error('Error creating verification code');
    }

    return { data: { code } }
  }
}
