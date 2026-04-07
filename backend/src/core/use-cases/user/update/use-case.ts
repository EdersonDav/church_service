import { Injectable } from '@nestjs/common';
import { Input } from './input';
import { Output } from './output';
import { GetUser } from '../get';
import { UserRepository } from '../../../../database/repositories/interfaces';
import { UUID } from 'crypto';
import { removeNullUndefinedFields } from '../../../helpers';

@Injectable()
export class UpdateUser {
  constructor(
    private userRepository: UserRepository,
    private getUser: GetUser
  ) { }
  async execute({ update_by, user_data }: Input): Promise<Output> {
    let id = user_data.id || '' as UUID;
    if (!id) {
      const user = await this.getUser.execute({ search_by: update_by, search_data: user_data[update_by] });
      if (!user.data || !user.data.id) {
        throw new Error('Error during user update: user not found');
      }
      id = user.data.id;
    }
    const data = await this.userRepository.update(id, removeNullUndefinedFields(user_data));
    if (!data) {
      throw new Error('Error updating user');
    }

    return {
      data
    }
  }
}
