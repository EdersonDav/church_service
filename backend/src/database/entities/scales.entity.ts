import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum, ScaleStatusEnum } from '../../enums';
import { Sector } from './sectors.entity';
import { Participant } from './participants.entity';
import { ScaleSong } from './scale-songs.entity';

@Entity(EntityEnum.SCALE)
@Unique(['sector_id', 'date'])
export class Scale extends BaseEntity {
  @Column({ default: 'Escala' })
  title!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ type: 'varchar', default: ScaleStatusEnum.DRAFT })
  status!: ScaleStatusEnum;

  @Column({ type: 'timestamp' })
  date!: Date;

  @Column()
  sector_id!: string;

  @ManyToOne(() => Sector, (sector) => sector.scales)
  @JoinColumn({ name: 'sector_id' })
  sector!: Sector;

  @OneToMany(() => Participant, (participant) => participant.scale)
  participants?: Participant[];

  @OneToMany(() => ScaleSong, (scale_song) => scale_song.scale)
  songs?: ScaleSong[];
}
