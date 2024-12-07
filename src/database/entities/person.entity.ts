import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base';
import { RoleEnum, EntityEnum } from '../../enums';

@Entity(EntityEnum.PESSOAS)
export class Pessoa extends BaseEntity<Pessoa> {
  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.VOLUNTARIO, enumName: 'RoleEnum' })
  role!: RoleEnum;
}
