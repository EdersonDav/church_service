import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { GetNotVerifiedUser } from '../getNoVerified/use-case';
import { UpdateUser } from '../update/use-case';
import { UserRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class CreateUser {
  constructor(
    private userRepository: UserRepository,
    private getNotVerifiedUser: GetNotVerifiedUser,
    private updateUser: UpdateUser
  ) { }
  async execute(input: Input): Promise<Output> {
    const userFound = await this.getNotVerifiedUser.execute({email: input.email});
    if (userFound.data) {
      return await this.updateUser.execute({update_by: 'id', user_data: input});
    }
    const data = await this.userRepository.save(input);
    return {
      data
    }
  }
}
