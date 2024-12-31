import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { RoleEnum, EntityEnum } from '../../enums';

@Entity(EntityEnum.USER)
@Unique(['email'])
export class User extends BaseEntity<User> {
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.VOLUNTARY, enumName: 'RoleEnum' })
  role!: RoleEnum;

  @Column()
  name!: string;
}
