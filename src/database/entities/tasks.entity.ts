import { Column, Entity, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';

@Entity(EntityEnum.TASK)
@Unique(['name'])
export class TASK extends BaseEntity<TASK> {
  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  description?: string;
}
