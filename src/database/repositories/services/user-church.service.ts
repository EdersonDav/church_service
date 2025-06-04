import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { UserChurch } from '../../entities';
import { UserChurchRepository } from '../interfaces';

@Injectable()
export class UserChurchService implements UserChurchRepository {
  constructor(
    @InjectRepository(UserChurch)
    private readonly entity: TypeORMRepository<UserChurch>
  ) { }

  async getByUserAndChurch(user_id: string, church_id: string): Promise<UserChurch | null> {
    return await this.entity.findOne({
      where: {
        user_id,
        church_id
      }
    });
  }

  async save(userChurch: Partial<UserChurch>): Promise<UserChurch> {
    const userChurchCreated = this.entity.create(userChurch);
    const savedUserChurch = await this.entity.save(userChurchCreated);
    return savedUserChurch;
  }
}
