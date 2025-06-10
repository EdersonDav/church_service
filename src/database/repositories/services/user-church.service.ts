import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Church, User, UserChurch } from '../../entities';
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
    await this.entity.upsert(userChurchCreated, {
      conflictPaths: ['user_id', 'church_id'],
      skipUpdateIfNoValuesChanged: true,
      upsertType: 'on-conflict-do-update'
    });
    return userChurchCreated
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async getChurchMembers(church_id: UUID): Promise<{ church: Partial<Church>; members: Partial<User>[] }> {
    const members = await this.entity.find({
      where: {
        church_id
      },
      relations: {
        user: true,
        church: true
      }
    });

    return {
      church: members[0]?.church,
      members: members.map(member => member.user)
    };
  }
}
