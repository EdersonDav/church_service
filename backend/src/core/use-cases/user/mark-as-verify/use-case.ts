import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { UserRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class MarkAsVerifiedUser {
  constructor(
    private userRepository: UserRepository,
  ) { }
  async execute({user_id}: Input): Promise<void> {
    if (!user_id) {
      throw new Error('Error during update user');
    }
    await this.userRepository.markAsVerified(user_id);
  }
}
