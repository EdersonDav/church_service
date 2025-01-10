import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';

@Entity(EntityEnum.SCALE)
@Unique(['sector_id', 'date'])
export class Scale extends BaseEntity<Scale> {
  @Column({ type: 'timestamp' })
  date!: Date;

  @ManyToOne(() => Sector, (sector) => sector.scale, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  sector!: Sector;
}