import { BaseRepository } from './base/base.repository';
import { Participant } from '../../entities';

export abstract class ParticipantRepository extends BaseRepository<Participant> {
    abstract findByScale(scale_id: string): Promise<Participant[]>;
    abstract findByUserAndDate(user_id: string, date: Date): Promise<Participant[]>;
}
