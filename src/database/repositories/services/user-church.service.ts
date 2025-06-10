import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { UserChurch } from '../../entities';
import { UserChurchRepository } from '../interfaces';
import { UUID } from 'crypto';

@Injectable()
export class UserChurchService implements UserChurchRepository {
  constructor(
    @InjectRepository(UserChurch)
    private readonly entity: TypeORMRepository<UserChurch>
  ) { }

  async getByUserAndChurch(user_id: UUID, church_id: UUID): Promise<UserChurch | null> {
    return await this.entity.findOne({
      where: {
        user_id,
        church_id
      },
      relations: {
        church: true,
        user: true
      }
    });
  }

  async save(userChurch: Partial<UserChurch>): Promise<UserChurch> {
    const userChurchCreated = this.entity.create(userChurch);
    const savedUserChurch = await this.entity.save(userChurchCreated);
    return savedUserChurch;
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }
}
