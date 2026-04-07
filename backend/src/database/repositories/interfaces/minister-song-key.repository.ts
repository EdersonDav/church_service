import { UUID } from 'crypto';
import { MinisterSongKey } from '../../entities';
import { BaseRepository } from './base/base.repository';

export abstract class MinisterSongKeyRepository extends BaseRepository<MinisterSongKey> {
  abstract getByMinisterAndSong(minister_id: UUID, song_id: UUID): Promise<MinisterSongKey | null>;
  abstract listByMinister(minister_id: UUID): Promise<MinisterSongKey[]>;
  abstract listByMinisterAndSongs(minister_id: UUID, song_ids: UUID[]): Promise<MinisterSongKey[]>;
  abstract upsertByMinisterAndSong(minister_id: UUID, song_id: UUID, custom_key: string): Promise<MinisterSongKey>;
}
