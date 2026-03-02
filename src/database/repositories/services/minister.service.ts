import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository as TypeORMRepository } from 'typeorm';
import { UUID } from 'crypto';
import { Minister } from '../../entities';
import { MinisterRepository } from '../interfaces';

@Injectable()
export class MinisterService implements MinisterRepository {
  constructor(
    @InjectRepository(Minister)
    private readonly entity: TypeORMRepository<Minister>,
  ) { }

  async save(minister_data: Partial<Minister>): Promise<Minister> {
    const minister = this.entity.create(minister_data);
    return this.entity.save(minister);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async getById(minister_id: UUID): Promise<Minister | null> {
    return this.entity.findOne({
      where: { id: minister_id },
      relations: {
        user: true,
        church: true,
      },
    });
  }

  async getByUserAndChurch(user_id: UUID, church_id: UUID): Promise<Minister | null> {
    return this.entity.findOne({
      where: {
        user_id,
        church_id,
      },
      relations: {
        user: true,
        church: true,
      },
    });
  }

  async listByChurch(church_id: UUID): Promise<Minister[]> {
    return this.entity.find({
      where: { church_id },
      relations: {
        user: true,
      },
      order: {
        name: 'ASC',
      },
    });
  }

  async findByChurchAndUsers(church_id: UUID, user_ids: UUID[]): Promise<Minister[]> {
    if (!user_ids.length) {
      return [];
    }

    return this.entity.find({
      where: {
        church_id,
        user_id: In(user_ids),
      },
      relations: {
        user: true,
      },
    });
  }
}
