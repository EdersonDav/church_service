import { BaseRepository } from './base/base.repository';
import { ExtraEvent } from '../../entities';
import { UUID } from 'crypto';

export abstract class ExtraEventRepository extends BaseRepository<ExtraEvent> {
  abstract getById(event_id: UUID): Promise<ExtraEvent | null>;
  abstract listByChurch(church_id: UUID): Promise<ExtraEvent[]>;
  abstract update(event_id: UUID, event_set: Partial<ExtraEvent>): Promise<ExtraEvent | null>;
}
