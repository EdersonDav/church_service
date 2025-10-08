import { BaseRepository } from './base/base.repository';
import { Scale } from '../../entities';

export abstract class ScaleRepository extends BaseRepository<Scale> {
    abstract findById(scale_id: string): Promise<Scale | null>;
    abstract findBySector(sector_id: string): Promise<Scale[]>;
    abstract findBySectorAndDate(sector_id: string, date: Date): Promise<Scale | null>;
    abstract update(scale_id: string, data: Partial<Scale>): Promise<Scale | null>;
}
