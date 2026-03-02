import { Column, Entity, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Sector } from './sectors.entity';
import { ExtraEvent } from './extra-events.entity';
import { Song } from './songs.entity';
import { Minister } from './ministers.entity';

@Entity(EntityEnum.CHURCH)
export class Church extends BaseEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Sector, (sector) => sector.church)
  sectors?: Sector[];

  @OneToMany(() => ExtraEvent, (event) => event.church)
  extra_events?: ExtraEvent[];

  @OneToMany(() => Song, (song) => song.church)
  songs?: Song[];

  @OneToMany(() => Minister, (minister) => minister.church)
  ministers?: Minister[];
}
