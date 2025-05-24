import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { VerificationCodeRepository } from '../../../../database/repositories/interfaces';
import { dateIsLaterNow } from '../../../helpers/dateIsLaterNow';
import { Output } from './output';

@Injectable()
export class VerifyCode {
  constructor(
    private repository: VerificationCodeRepository,
  ) { }
  async execute(input: Input): Promise<Output> {
    const verificationCode = await this.repository.verifyCode(input.code, input.user_id);
    return {
      data: !!(verificationCode && dateIsLaterNow(new Date(verificationCode.expires_at)))
    }
  }
}
