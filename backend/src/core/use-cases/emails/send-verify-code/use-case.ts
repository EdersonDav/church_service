import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { EmailRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class SendVerifyCode {
  constructor(
    private emailRepository: EmailRepository,
  ) { }
  async execute(input: Input): Promise<void> {
    this.emailRepository.sendVerificationCode(input.email, input.code);
  }
}
