import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { GetUser } from '../get';
import { UserRepository } from '../../../../database/repositories/interfaces';

@Injectable()
export class UpdatePasswordUser {
  constructor(
    private userRepository: UserRepository,
    private getUser: GetUser
  ) { }
  async execute({ email, password }: Input): Promise<Output> {
    const user = await this.getUser.execute({ search_by: 'email', search_data: email });
    if (!user.data || !user.data.id) {
      throw new Error('Error during user update: user not found');
    }
    const data = await this.userRepository.updatePassword(email, password);
    if (!data) {
      throw new Error('Error updating user');
    }

    return {
      data
    }
  }
}
