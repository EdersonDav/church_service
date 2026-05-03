import { BaseRepository } from './base/base.repository';
import { Participant } from '../../entities';

export abstract class ParticipantRepository extends BaseRepository<Participant> {
    abstract findByScale(scale_id: string): Promise<Participant[]>;
    abstract findByUserAndDate(user_id: string, date: Date): Promise<Participant[]>;
    abstract findByUserAndRange(user_id: string, start_date: Date, end_date: Date): Promise<Participant[]>;
}
