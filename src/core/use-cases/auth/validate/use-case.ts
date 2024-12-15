import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt'

import { Input } from './input';
import { UserRepository } from '../../../../database/repositories/interfaces';
import { Output } from './output';

@Injectable()
export class ValidateUser {
  constructor(private readonly userRepository: UserRepository) { }
  async execute({ email, password }: Input): Promise<Output> {
    const user = await this.userRepository.getByEmail(email);
    if (user && bcrypt.compareSync(password, user.password)) {
      return { user };
    }
    return { user: null };
  }
}
