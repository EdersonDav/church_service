import { BaseRepository } from './base/base.repository';
import { UserChurch } from '../../entities/user-church.entity';
import { Church, User } from '../../entities';

export abstract class UserChurchRepository extends BaseRepository<UserChurch> {
    abstract getByUserAndChurch(user_id: string, church_id: string): Promise<UserChurch | null>;
    abstract getChurchMembers(church_id: string): Promise<{ church: Partial<Church>; members: Partial<User>[] }>;
}
