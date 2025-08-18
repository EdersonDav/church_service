import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { ChurchRoleEnum, EntityEnum } from '../../enums';
import { User } from './users.entity';
import { Church } from './churches.entity';
import { UUID } from 'crypto';

@Entity(EntityEnum.USER_CHURCH)
@Unique('user_church_unique', ['user', 'church'])
export class UserChurch extends BaseEntity {
  @Column({ type: 'enum', enum: ChurchRoleEnum, default: ChurchRoleEnum.VOLUNTARY, enumName: 'ChurchRoleEnum' })
  role!: ChurchRoleEnum;

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
