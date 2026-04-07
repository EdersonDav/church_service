import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Minister } from './ministers.entity';
import { Song } from './songs.entity';
import { UUID } from 'crypto';

@Entity(EntityEnum.MINISTER_SONG_KEY)
@Unique(['minister_id', 'song_id'])
export class MinisterSongKey extends BaseEntity {
  @Column({ type: 'uuid' })
  minister_id!: UUID;

  @ManyToOne(() => Minister, (minister) => minister.song_keys, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'minister_id' })
  minister!: Minister;

  @Column({ type: 'uuid' })
  song_id!: UUID;

  @ManyToOne(() => Song, (song) => song.minister_song_keys, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song!: Song;

  @Column()
  custom_key!: string;
}
