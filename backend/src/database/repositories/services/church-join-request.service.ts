import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UUID } from 'crypto';
import { Repository as TypeORMRepository } from 'typeorm';
import {
  ChurchJoinRequest,
  ChurchJoinRequestStatusEnum,
} from '../../entities';
import { ChurchRoleEnum } from '../../../enums';
import { ChurchJoinRequestRepository } from '../interfaces';

@Injectable()
export class ChurchJoinRequestService implements ChurchJoinRequestRepository {
  constructor(
    @InjectRepository(ChurchJoinRequest)
    private readonly entity: TypeORMRepository<ChurchJoinRequest>
  ) { }

  async getById(id: UUID): Promise<ChurchJoinRequest | null> {
    return this.entity.findOne({
      where: { id },
      relations: {
        church: true,
        user: true,
      },
    });
  }

  async getByUserAndChurch(user_id: UUID, church_id: UUID): Promise<ChurchJoinRequest | null> {
    return this.entity.findOne({
      where: {
        user_id,
        church_id,
      },
      relations: {
        church: true,
        user: true,
      },
    });
  }

  async listPendingForAdmin(user_id: UUID): Promise<ChurchJoinRequest[]> {
    return this.entity
      .createQueryBuilder('request')
      .innerJoinAndSelect('request.church', 'church')
      .innerJoinAndSelect('request.user', 'user')
      .innerJoin(
        'user_church',
        'admin_church',
        'admin_church.church_id = request.church_id AND admin_church.user_id = :user_id AND admin_church.role IN (:...roles)',
        { user_id, roles: [ChurchRoleEnum.ADMIN, ChurchRoleEnum.ROOT] },
      )
      .where('request.status = :status', { status: ChurchJoinRequestStatusEnum.PENDING })
      .orderBy('request.created_at', 'DESC')
      .getMany();
  }

  async save(joinRequest: Partial<ChurchJoinRequest>): Promise<ChurchJoinRequest> {
    const current = await this.getByUserAndChurch(joinRequest.user_id!, joinRequest.church_id!);

    if (current) {
      current.status = joinRequest.status ?? ChurchJoinRequestStatusEnum.PENDING;
      return this.entity.save(current);
    }

    return this.entity.save(this.entity.create(joinRequest));
  }

  async updateStatus(id: UUID, status: ChurchJoinRequestStatusEnum): Promise<ChurchJoinRequest | null> {
    const current = await this.getById(id);

    if (!current) {
      return null;
    }

    current.status = status;
    return this.entity.save(current);
  }

  async delete(id: string): Promise<void> {
    await this.entity.delete(id);
  }
}
