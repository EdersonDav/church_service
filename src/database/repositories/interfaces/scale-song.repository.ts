import { UUID } from 'crypto';
import { ScaleSong } from '../../entities';
import { BaseRepository } from './base/base.repository';

export abstract class ScaleSongRepository extends BaseRepository<ScaleSong> {
  abstract findByScale(scale_id: UUID): Promise<ScaleSong[]>;
  abstract update(scale_song_id: UUID, data: Partial<ScaleSong>): Promise<ScaleSong | null>;
}
