import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { UUID } from 'crypto';
import { BaseEntity } from './base';
import { Church } from './churches.entity';
import { User } from './users.entity';
import { EntityEnum } from '../../enums';

export enum ChurchJoinRequestStatusEnum {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

@Entity(EntityEnum.CHURCH_JOIN_REQUEST)
@Unique('church_join_request_unique', ['user', 'church'])
export class ChurchJoinRequest extends BaseEntity {
  @Column({
    type: 'enum',
    enum: ChurchJoinRequestStatusEnum,
    default: ChurchJoinRequestStatusEnum.PENDING,
    enumName: 'ChurchJoinRequestStatusEnum',
  })
  status!: ChurchJoinRequestStatusEnum;

  @Column({ type: 'uuid' })
  user_id!: UUID;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ type: 'uuid' })
  church_id!: UUID;

  @ManyToOne(() => Church, (church) => church.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'church_id' })
  church!: Church;
}
