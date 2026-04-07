import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { EmailRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class SendResetPasswordToken {
  constructor(
    private emailRepository: EmailRepository,
  ) { }
  async execute(input: Input): Promise<void> {
    this.emailRepository.sendResetPassword(input.email, input.token);
  }
}
