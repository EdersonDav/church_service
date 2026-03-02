import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Scale } from './scales.entity';
import { Song } from './songs.entity';
import { Minister } from './ministers.entity';
import { UUID } from 'crypto';

@Entity(EntityEnum.SCALE_SONG)
@Unique(['scale_id', 'song_id'])
export class ScaleSong extends BaseEntity {
  @Column({ type: 'uuid' })
  scale_id!: UUID;

  @ManyToOne(() => Scale, (scale) => scale.songs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'scale_id' })
  scale!: Scale;

  @Column({ type: 'uuid' })
  song_id!: UUID;

  @ManyToOne(() => Song, (song) => song.scale_songs, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'song_id' })
  song!: Song;

  @Column()
  key!: string;

  @Column({ type: 'uuid', nullable: true })
  minister_id?: UUID | null;

  @ManyToOne(() => Minister, (minister) => minister.scale_songs, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'minister_id' })
  minister?: Minister | null;
}
