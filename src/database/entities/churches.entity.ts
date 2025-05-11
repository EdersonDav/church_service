import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';

@Entity(EntityEnum.CHURCH)
@Unique(['name'])
export class Church extends BaseEntity {
  @Column({ unique: true })
  name!: string;

  @OneToMany(() => Sector, (sector) => sector.church)
  sectors?: Sector[];
}
