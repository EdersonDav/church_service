import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';
import { MinisterSongKey } from './minister-song-keys.entity';
import { ScaleSong } from './scale-songs.entity';
import { UUID } from 'crypto';

@Entity(EntityEnum.SONG)
@Unique(['church_id', 'title'])
export class Song extends BaseEntity {
  @Column()
  title!: string;

  @Column()
  default_key!: string;

  @Column({ type: 'uuid' })
  church_id!: UUID;

  @ManyToOne(() => Church, (church) => church.songs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'church_id' })
  church!: Church;

  @OneToMany(() => MinisterSongKey, (item) => item.song)
  minister_song_keys?: MinisterSongKey[];

  @OneToMany(() => ScaleSong, (item) => item.song)
  scale_songs?: ScaleSong[];
}
