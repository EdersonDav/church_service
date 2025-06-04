import { BaseRepository } from './base/base.repository';
import { UserChurch } from '../../entities/user-church.entity';

export abstract class UserChurchRepository extends BaseRepository<UserChurch> {
    abstract getByUserAndChurch(user_id: string, church_id: string): Promise<UserChurch | null>;
}
