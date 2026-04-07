import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { EmailRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class SendUserAlreadyExists {
  constructor(
    private emailRepository: EmailRepository,
  ) { }
  async execute(input: Input): Promise<void> {
    this.emailRepository.sendUserAlreadyExistsEmail(input.email);
  }
}
