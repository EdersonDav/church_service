import { Column, Entity, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';
import { Participant } from './participants.entity';

@Entity(EntityEnum.SCALE)
@Unique(['sector_id', 'date'])
export class Scale extends BaseEntity {
  @Column({ type: 'timestamp' })
  date!: Date;

  @Column()
  sector_id!: string;

  @ManyToOne(() => Sector, (sector) => sector.scales)
  sector!: Sector;

  @OneToMany(() => Participant, (participant) => participant.scale)
  participants?: Participant[];
}