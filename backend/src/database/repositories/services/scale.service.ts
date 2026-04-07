import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { Scale } from '../../entities';
import { ScaleRepository } from '../interfaces';
import { UUID } from 'crypto';

@Injectable()
export class ScaleService implements ScaleRepository {
  constructor(
    @InjectRepository(Scale)
    private readonly entity: TypeORMRepository<Scale>
  ) { }

  async save(scale: Partial<Scale>): Promise<Scale> {
    const created = this.entity.create(scale);
    return this.entity.save(created);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async findById(scale_id: string): Promise<Scale | null> {
    return this.entity.findOne({
      where: { id: scale_id as UUID },
      relations: {
        sector: true,
        participants: {
          user: true,
          task: true,
        },
      },
    });
  }

  async findBySector(sector_id: string): Promise<Scale[]> {
    return this.entity.find({
      where: { sector_id },
      relations: {
        participants: {
          user: true,
          task: true,
        },
      },
      order: {
        date: 'ASC',
      },
    });
  }

  async findBySectorAndDate(sector_id: string, date: Date): Promise<Scale | null> {
    return this.entity.findOne({
      where: { sector_id, date },
    });
  }

  async update(scale_id: string, data: Partial<Scale>): Promise<Scale | null> {
    const scale = await this.entity.findOne({ where: { id: scale_id as UUID } });
    if (!scale) {
      return null;
    }

    Object.assign(scale, data);
    return this.entity.save(scale);
  }
}
