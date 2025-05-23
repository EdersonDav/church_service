import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { UserRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class GetNotVerifiedUser {
  constructor(
    private userRepository: UserRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userRepository.getNotVerifiedByEmail(input.email);
    return {data};
  }
}
