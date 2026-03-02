import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeORMRepository } from 'typeorm';
import { ExtraEvent } from '../../entities';
import { ExtraEventRepository } from '../interfaces';
import { UUID } from 'crypto';

@Injectable()
export class ExtraEventService implements ExtraEventRepository {
  constructor(
    @InjectRepository(ExtraEvent)
    private readonly entity: TypeORMRepository<ExtraEvent>
  ) { }

  async save(event_data: Partial<ExtraEvent>): Promise<ExtraEvent> {
    const event = this.entity.create(event_data);
    return this.entity.save(event);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }

  async getById(event_id: UUID): Promise<ExtraEvent | null> {
    return this.entity.findOneBy({ id: event_id });
  }

  async listByChurch(church_id: UUID): Promise<ExtraEvent[]> {
    return this.entity.find({
      where: { church_id },
      order: {
        date: 'ASC',
      },
    });
  }

  async update(event_id: UUID, event_set: Partial<ExtraEvent>): Promise<ExtraEvent | null> {
    const event = await this.entity.findOneBy({ id: event_id });
    if (!event) {
      return null;
    }

    Object.assign(event, event_set);
    return this.entity.save(event);
  }
}
