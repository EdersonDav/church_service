import { BaseRepository } from './base/base.repository';
import { Church } from '../../entities/churches.entity';
import { UUID } from 'crypto';

export abstract class ChurchRepository extends BaseRepository<Church> {
    abstract update(church_id: UUID, church_set: Partial<Church>): Promise<Church | null>;
}
