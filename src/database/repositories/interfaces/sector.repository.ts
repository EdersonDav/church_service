import { BaseRepository } from './base/base.repository';
import { Sector } from '../../entities/sectors.entity';
import { UUID } from 'crypto';

export abstract class SectorRepository extends BaseRepository<Sector> {
    abstract update(sector_id: UUID, sector_set: Partial<Sector>): Promise<Sector | null>;
    abstract getBy<K extends keyof Sector>(search_value: Sector[K], search_by: K): Promise<Sector | null>;
}
