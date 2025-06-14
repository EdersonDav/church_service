import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { User } from '../../entities';
import { UserRepository } from '../interfaces';
import { hashString } from '../../../core/helpers';
import { UUID } from 'crypto';

@Injectable()
export class UserService implements UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly entity: TypeORMRepository<User>,
  ) { }

  async deleteByEmail(email: string): Promise<void> {
    await this.entity.delete({ email });
  }

  async getBy<K extends keyof User>(search_value: User[K], search_by: K): Promise<User | null> {
    const userFound = await this.entity.findOne({ where: { [search_by]: search_value } })
    return userFound
  }

  async save(user: User): Promise<User> {
    const userCreated = this.entity.create({ ...user, password: hashString(user.password) });
    const userSaved = await this.entity.save(userCreated);
    return userSaved;
  }

  async update(user_id: UUID, user_set: Partial<User>): Promise<User | null> {
    const userFound = await this.entity.findOne({ where: { id: user_id } })
    if (user_set?.password) {
      user_set.password = hashString(user_set.password);
    }
    if (!userFound) throw new Error('User not found')
    const userUpdated = await this.entity.update({ id: user_id }, { ...user_set })
    if (!userUpdated.affected) return null;
    return await this.getBy(user_id, 'id');
  }

  async getNotVerifiedByEmail(email: string): Promise<User | null> {
    const userFound = await this.entity.findOne({ where: { email, is_verified: false } })
    return userFound
  }

  async markAsVerified(user_id: UUID): Promise<void> {
    await this.entity.update({ id: user_id }, { is_verified: true });
  }

  async updatePassword(email: string, password: string): Promise<boolean> {
    const userUpdated = await this.entity.update({ email }, {
      password: hashString(password)
    });

    return !!userUpdated.affected
  }
}
