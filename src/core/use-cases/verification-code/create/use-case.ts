import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { VerificationCodeRepository } from '../../../../database/repositories/interfaces';
import { VerificationCode } from '../../../../database/entities';
import { genCode, genExpiredDate } from '../../../helpers';

@Injectable()
export class CreateVerificationCode {
  constructor(
    private repository: VerificationCodeRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    
    const verificationCode: Partial<VerificationCode> = {
      code: genCode(),
      user_id: input.user.id,
      expires_at: genExpiredDate(),
      user: input.user
    }
    const data = await this.repository.save(verificationCode);
    return {
      created: data
    }
  }
}
