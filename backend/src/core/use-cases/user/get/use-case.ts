import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { UserRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class GetUser {
  constructor(
    private userRepository: UserRepository
  ) { }
  async execute(input: Input): Promise<Output> {
    const data = await this.userRepository.getBy(input.search_data, input.search_by);
    return {data};
  }
}
