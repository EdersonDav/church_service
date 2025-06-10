import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';

@Entity(EntityEnum.CHURCH)
export class Church extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Sector, (sector) => sector.church)
  sectors?: Sector[];
}
