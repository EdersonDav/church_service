import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Sector, User, UserSector } from '../../entities';
import { UserSectorRepository } from '../interfaces';
import { UUID } from 'crypto';

@Injectable()
export class UserSectorService implements UserSectorRepository {
  constructor(
    @InjectRepository(UserSector)
    private readonly entity: TypeORMRepository<UserSector>
  ) { }

  async getByUserAndSector(user_id: UUID, sector_id: UUID): Promise<UserSector | null> {
    return await this.entity.findOne({
      where: {
        user_id,
        sector_id
      },
      relations: {
        sector: true,
        user: true
      }
    });
  }

  async save(userSector: Partial<UserSector>): Promise<UserSector> {
    const userSectorCreated = this.entity.create(userSector);
    await this.entity.upsert(userSectorCreated, {
      conflictPaths: ['user_id', 'sector_id'],
      skipUpdateIfNoValuesChanged: true,
      upsertType: 'on-conflict-do-update'
    });
    return userSectorCreated
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async getSectorMembers(sector_id: UUID): Promise<{ sector: Partial<Sector>; members: Partial<User>[] }> {
    const members = await this.entity.find({
      where: {
        sector_id
      },
      relations: {
        user: true,
        sector: true
      }
    });

    return {
      sector: members[0]?.sector,
      members: members.map(member => member.user)
    };
  }
}
