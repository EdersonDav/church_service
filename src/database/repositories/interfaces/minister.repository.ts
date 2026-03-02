import { UUID } from 'crypto';
import { Minister } from '../../entities';
import { BaseRepository } from './base/base.repository';

export abstract class MinisterRepository extends BaseRepository<Minister> {
  abstract getById(minister_id: UUID): Promise<Minister | null>;
  abstract getByUserAndChurch(user_id: UUID, church_id: UUID): Promise<Minister | null>;
  abstract listByChurch(church_id: UUID): Promise<Minister[]>;
  abstract findByChurchAndUsers(church_id: UUID, user_ids: UUID[]): Promise<Minister[]>;
}
