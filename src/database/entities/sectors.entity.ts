import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';

@Entity(EntityEnum.SECTOR)
@Unique(['name'])
export class Sector extends BaseEntity<Sector> {
  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => Church, (church) => church.sectors, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  church!: Church;
}