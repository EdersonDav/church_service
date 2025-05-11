import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { RoleEnum, EntityEnum } from '../../enums';
import { User } from './users.entity';
import { Church } from './churches.entity';

@Entity(EntityEnum.USER_CHURCH)
@Unique('user_church_unique', ['user_id', 'church_id'] )
export class UserChurch extends BaseEntity {
  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.VOLUNTARY, enumName: 'RoleEnum' })
  role!: RoleEnum;

  @Column()
  user_id!: string;

  @Column()
  church_id!: string;

  @ManyToOne(() => User, (user) => user.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user!: User;
  
  @ManyToOne(() => Church, (church) => church.id, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  church!: Church;
}
