import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Unavailability } from '../../entities';
import { UnavailabilityRepository } from '../interfaces';

@Injectable()
export class UnavailabilityService implements UnavailabilityRepository {
  constructor(
    @InjectRepository(Unavailability)
    private readonly entity: TypeORMRepository<Unavailability>
  ) { }

  async save(unavailability: Partial<Unavailability>): Promise<Unavailability> {
    const created = this.entity.create(unavailability);
    return this.entity.save(created);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async listByUser(user_id: string): Promise<Unavailability[]> {
    return this.entity.find({
      where: { user_id },
      order: { date: 'ASC' },
    });
  }

  async findByUserAndDate(user_id: string, date: Date): Promise<Unavailability | null> {
    return this.entity
      .createQueryBuilder('unavailability')
      .where('unavailability.user_id = :user_id', { user_id })
      .andWhere('DATE(unavailability.date) = DATE(:date)', { date })
      .getOne();
  }
}
