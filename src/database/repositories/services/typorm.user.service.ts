import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { User } from '../../entities';
import { UserRepository } from '../interfaces';

@Injectable()
export class UserService implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly entity: TypeORMRepository<User>,
  ) { }

  async getByEmail(email: string): Promise<User | null> {
    const userFound = await this.entity.findOne({ where: { email } })
    return userFound
  }

  async save(user: Partial<User>): Promise<User> {
    const user_created = this.entity.create(user);
    await this.entity.save(user_created);
    return user_created;
  }
}
