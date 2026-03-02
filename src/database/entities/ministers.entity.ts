import { Column, Entity, JoinColumn, ManyToOne, OneToMany, Unique } from 'typeorm';
import { BaseEntity } from './base';
import { EntityEnum } from '../../enums';
import { Church } from './churches.entity';
import { User } from './users.entity';
import { MinisterSongKey } from './minister-song-keys.entity';
import { ScaleSong } from './scale-songs.entity';
import { UUID } from 'crypto';

@Entity(EntityEnum.MINISTER)
@Unique(['church_id', 'user_id'])
export class Minister extends BaseEntity {
  @Column({ type: 'uuid' })
  church_id!: UUID;

  @ManyToOne(() => Church, (church) => church.ministers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'church_id' })
  church!: Church;

  @Column({ type: 'uuid' })
  user_id!: UUID;

  @ManyToOne(() => User, (user) => user.ministers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column()
  name!: string;

  @OneToMany(() => MinisterSongKey, (item) => item.minister)
  song_keys?: MinisterSongKey[];

  @OneToMany(() => ScaleSong, (item) => item.minister)
  scale_songs?: ScaleSong[];
}
