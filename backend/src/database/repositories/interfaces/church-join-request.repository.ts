import { UUID } from 'crypto';
import {
  ChurchJoinRequest,
  ChurchJoinRequestStatusEnum,
} from '../../entities';
import { BaseRepository } from './base/base.repository';

export abstract class ChurchJoinRequestRepository extends BaseRepository<ChurchJoinRequest> {
  abstract getById(id: UUID): Promise<ChurchJoinRequest | null>;
  abstract getByUserAndChurch(user_id: UUID, church_id: UUID): Promise<ChurchJoinRequest | null>;
  abstract listPendingForAdmin(user_id: UUID): Promise<ChurchJoinRequest[]>;
  abstract updateStatus(id: UUID, status: ChurchJoinRequestStatusEnum): Promise<ChurchJoinRequest | null>;
}
