import { BaseRepository } from './base/base.repository';
import { Unavailability } from '../../entities';

export abstract class UnavailabilityRepository extends BaseRepository<Unavailability> {
    abstract listByUser(user_id: string): Promise<Unavailability[]>;
    abstract findByUserAndDate(user_id: string, date: Date): Promise<Unavailability | null>;
}
