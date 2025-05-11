import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { UserRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class CreateUser {
  constructor(
    private userRepository: UserRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userRepository.save(input);
    return {
      data: {
        name: data.name,
        email: data?.email
      }
    }
  }
}
