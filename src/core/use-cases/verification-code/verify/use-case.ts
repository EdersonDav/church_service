import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { VerificationCodeRepository } from '../../../../database/repositories/interfaces';
import { VerificationCode } from '../../../../database/entities';
import { genCode, genExpiredDate } from '../../../helpers';
import { GetUser } from '../../user/get';
import { MarkAsVerifiedUser } from '../../user/markAsVerify';
import { dateIsLaterNow } from '../../../helpers/dateIsLaterNow';
import { Output } from './output';

@Injectable()
export class CreateVerificationCode {
  constructor(
    private repository: VerificationCodeRepository,
    private readonly getUser: GetUser,
    private readonly markAsVerifiedUser: MarkAsVerifiedUser,
  ) { }
  async execute(input: Input): Promise<Output> {
    if (!input.email) {
      throw new Error('Error during verify verification code');
    }
    const user = await this.getUser.execute({search_by: 'email', search_data: input.email });
    if (!user.data?.id) {
      throw new Error('User not found');
    }
    const verificationCode = await this.repository.verifyCode(input.code, user.data?.id);
    let message = 'Verification code not found';

    if(!verificationCode || !dateIsLaterNow(new Date(verificationCode.expires_at))) {
      return {
        data: { message }
      }
    }
    message = 'User verified successfully';

    await this.markAsVerifiedUser.execute({ user_id: user.data?.id });
    await this.repository.deleteByUserId(user.data?.id);
    return {
      data: { message }
    }
  }
}
