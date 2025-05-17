import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { User } from '../../entities';
import { UserRepository } from '../interfaces';
import { encodePass } from '../../../core/helpers';
import { UUID } from 'crypto';

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

  async save(user: User): Promise<User> {
    const userCreated = this.entity.create({...user, password: encodePass(user.password)});
    const userSaved = await this.entity.save(userCreated);
    return userSaved;
  }

  async update(user_id: UUID, user_set: Partial<User>): Promise<boolean> {
    const userFound = await this.entity.findOne({ where: { id: user_id } })
    if (!userFound) throw new Error('User not found')
    const userUpdated = await this.entity.update(userFound.id, user_set);
    return Boolean(userUpdated.affected);
  }
}
