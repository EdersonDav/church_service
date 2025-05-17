import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { UserRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class DeleteUser {
  constructor(
    private userRepository: UserRepository
  ) { }
  async execute(input: Input): Promise<void> {
    await this.userRepository.deleteByEmail(input.email);
  }
}
