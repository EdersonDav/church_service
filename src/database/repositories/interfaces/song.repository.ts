import { UUID } from 'crypto';
import { Song } from '../../entities';
import { BaseRepository } from './base/base.repository';

export abstract class SongRepository extends BaseRepository<Song> {
  abstract getById(song_id: UUID): Promise<Song | null>;
  abstract listByChurch(church_id: UUID): Promise<Song[]>;
  abstract findByIds(song_ids: UUID[]): Promise<Song[]>;
  abstract update(song_id: UUID, song_set: Partial<Song>): Promise<Song | null>;
}
